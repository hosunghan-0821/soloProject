from flask import Flask, render_template,request, jsonify
from werkzeug.utils import secure_filename
app = Flask(__name__)

# 주석 색깔확인


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/writePost')
def writePost():
    return render_template('일단후퇴.html')


@app.route('/board')
def board():
    return render_template('board.html')


@app.route('/saveImage', methods=["POST"])
def saveImage():
    print("ㅎ")
    image = request.files['filedata']

    print(image)
    # image.save(secure_filename('/static/Images'+image))
    # print(image)
    return jsonify({'msg': '데이터 전달완료'})


@app.route('/savePost',methods=["POST"])
def savePost():
    content= request.form['content']
    print(content)
    return jsonify({'msg': '데이터 전달완료'})


if __name__=='__main__':
    app.run('0.0.0.0',port=5000,debug=True)