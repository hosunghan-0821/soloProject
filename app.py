from flask import Flask, render_template,request, jsonify
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from datetime import datetime
from bson.json_util import dumps
from flask import flash
import os


# DB접근 관련
client = MongoClient('mongodb+srv://hosung:ghtjd114@Cluster0.rqdya.mongodb.net/?retryWrites=true&w=majority')
db = client.dbsparta

app = Flask(__name__)
app.secret_key = 'some_secret'
# rendering (html 파일 넘겨주기)
@app.route('/')
def home():
    return render_template('home.html',page='home')


@app.route('/bestSellers')
def bestSellers():
    best_sellers = list(db.bestSellers.find({}, {'_id': False}))
    doc = []
    for best_seller in best_sellers:
        data = {}
        data['title']  = best_seller['title']
        if best_seller['subtitle'] !='':
            data['sub_title']=best_seller['subtitle']
        data['image']=best_seller['image']
        print(data)
        doc.append(data)
    return jsonify(doc)
@app.route('/board')
def board():
    return render_template('board.html', page='board')

@app.route('/header')
def header():
    return render_template('header.html',response=board)

@app.route('/footer')
def footer():
    return render_template('footer.html')


@app.route('/write', methods=["GET"])
def writePost():
    post_num = request.args.get('postIdx')
    if post_num is not None:
        return render_template('write.html', post_num=post_num, update=True, page='write')
    else:
        return render_template('write.html', page='write')

@app.route('/readPost',methods=["GET"])
def readPost():
    post_num = request.args.get('postIdx')
    return render_template('readPost.html', post_num=post_num)

# 게시글 CRUD API 내용
#  게시글 읽기(불러오기 전체목록 &개별목록) (Read)
@app.route('/getRecord', methods=["POST","GET"])
def getRecord():
    # 전체 기록을 전달하는 경우
    if request.method == 'POST':
        all_records = list(db.readingRecord.find().sort('_id',-1))
        print(all_records)
        # page_sanitized = json.loads(dumps(all_records))
        # print(page_sanitized)
        # return jsonify(page_sanitized)
        return jsonify({'records' : dumps(all_records)})
    else:

        postIdx = request.args.get('postIdx')
        # postIdx = request.form['postIdx']
        print("postIdx : ",postIdx)
        doc = db.readingRecord.find_one({'postIdx': int(postIdx)},{"_id": False})
        print("doc : ",doc)
        return jsonify(doc)


#  게시글 작성 (Create)
@app.route('/savePost',methods=["POST"])
def savePost():
    # uploaded 된 다중 이미지 fileList
    image_files = request.files.getlist("files")
    # uploaded 된 기록 내용
    text = request.form['text']
    title = request.form['title']


    # db Collection 개수를 따로 저장 하는 counters collections 에서 게시글 번호
    doc = db.counters.find_one({'$and': [{"collections": 'reading_record'}, {"seq": {"$exists": True}}]})
    if doc is None:
        db.counters.update_one({"collections": "reading_record"}, {"$set": {'seq': 1}})
        seq = 1
    else:
        db.counters.update_one({"collections": "reading_record"}, {"$set": {'seq': doc['seq'] + 1}})
        seq = doc['seq'] + 1

    # 게시글 고유 번호
    post_num = seq

    # 이미지 서버컴에 저장하는 함수 작성
    if image_files is not None:
        file_paths = savePostImageInServer(image_files,post_num)
    else:
        file_paths = None

    # 이미지 MongoDB에 저장하는 함수 작성
    savePostInDB(title, text, file_paths,post_num)

    return jsonify( {'msg': 'success'} )


#  게시글 수정 (Update)
@app.route('/updatePost',methods=["POST"])
def updatePost():
    # uploaded 된 다중 이미지 fileList
    image_files = request.files.getlist("files")
    # uploaded 된 기록 내용
    text = request.form['text']
    title = request.form['title']
    post_num = request.form['update']

    # 이미지 서버컴에 저장하는 함수 작성
    if image_files is not None:
        file_paths = savePostImageInServer(image_files,post_num)
    else:
        file_paths = None

    updatePostInDB(title, text, file_paths, post_num)
    return jsonify({'msg': 'success', 'postIdx': post_num})


@app.route('/delete',methods=["GET"])
def deletePost():
    postIdx = request.args.get('postIdx')
    print(postIdx)
    to_delete_data = db.readingRecord.find_one({'postIdx': int(postIdx)})
    print(to_delete_data)
    # 서버에 있는 이미지 파일 삭제
    if 'Images' in to_delete_data:
        image_paths = to_delete_data['Images']
        print(image_paths)
        for image_path in image_paths:
            to_delete_file_path=image_path.split("/")[-1]
            if os.path.isfile(to_delete_file_path):
                os.remove('./static/Images/'+to_delete_file_path)
    # db 내용삭제해야겟지
    db.readingRecord.delete_one({'postIdx': int(postIdx)})
    flash("게시글 삭제 완료!")
    return render_template('board.html')


def updatePostInDB(title, content, file_paths, post_num):

    # 저장 날짜
    now = datetime.now()
    update_time = now.strftime("%Y%m%d")
    print(post_num)
    prev_data = db.readingRecord.find_one({'postIdx': int(post_num)})
    print(prev_data)
    date = prev_data['Date']
    if 'Images' in prev_data:
        update_file_paths = prev_data['Images']
        print("이전 이미지 데이터",update_file_paths)
    else:
        update_file_paths = []
    print("새로운 이미지 경로", file_paths)
    for image in file_paths:
        update_file_paths.append(image)

    print(update_file_paths)

    doc = {
            'postIdx': int(post_num),
            'title': title,
            'content': content,
            'Date': date,
            'updateDate': update_time,
            'Images': update_file_paths
    }

    print("doc", doc)
    db.readingRecord.replace_one( {'postIdx': int(post_num)}, doc)


def savePostInDB(title, content, files_path,post_num):

    # 저장 날짜
    now = datetime.now()
    current_time = now.strftime("%Y%m%d")
    # 이미지 경로, 제목, 내용을 이용하여 DB에 저장
    doc = {'postIdx': post_num,
           'title': title,
           'content': content,
           'Images': files_path,
           'Date': current_time}

    db.readingRecord.insert_one(doc)


def savePostImageInServer(image_files,post_num):

    # 현재 시간 가져와서 이미지 파일명으로 사용
    i = 1
    now = datetime.now()
    current_time = now.strftime("%Y%m%d_%H%M%S")


    # 서버에 저장된 이미지에 접근할 수 있는 경로 작성 (ip/port/directory 활용)
    file_route = []
    server_ip_port = "13.125.128.36:5000"
    route = "/static/Images/"

    # 파일을 서버 원하는 경로에 저장
    for file in image_files:

        # 파일명 (post id _ 현재 시간 _ 이미지 순서 _ 확장자 )
        filename = str(post_num) + "_" + current_time + "_" + str(i) + ".jpg"

        #파일 서버 directory에 저장하는 법 (정확히 사용법 모름)
        file.save(os.path.join("./static/Images/", secure_filename(filename)))

        #서버에 접근하는 URL
        file_path = "http://"+server_ip_port + route + filename

        i = i + 1
        file_route.append(file_path)

    return file_route


if __name__=='__main__':
    app.run('0.0.0.0',port=5000,debug=True)