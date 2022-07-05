from bs4 import BeautifulSoup
from pymongo import MongoClient
import requests


# DB접근 관련
client = MongoClient('mongodb+srv://hosung:ghtjd114@Cluster0.rqdya.mongodb.net/?retryWrites=true&w=majority')
db = client.dbsparta

# 크롤링 관련
headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
# 크롤링 할 페이지 url


def crawler():
    url = "https://www.kyobobook.co.kr/bestSellerNew/bestseller.laf?orderClick=d79&gclid=CjwKCAjwwdWVBhA4EiwAjcYJEDhcsjuCo47rwOnr_1t0UlUUrMaaFhBtZj_6GVO08RpUsMKXjOsX0BoC1qEQAvD_BwE"
    data = requests.get(url, headers=headers)

    # beautifulSoup를 활용해서 html파일로 변경해줌
    soup = BeautifulSoup(data.text, 'html.parser')

    best_sellers = soup.select('ul.list_type01 > li  ')
    i = 1
    # 내 db collection list
    list = db.list_collection_names()
    check_collection = True
    if 'bestSellers' not in list:
        check_collection = False
    for book in best_sellers:
        print(i)
        # 대표 이미지
        image = book.select_one("div.cover > a >img ")['src']
        #  부제목
        subtitle = book.select_one("div.detail > div.subtitle").text.strip()
        #  제목
        title = book.select_one("div.detail > div.title > a").text
        if subtitle != "":
            print(subtitle)
        else:
            print("subtitle 없음")
        print(book.select_one("div.title > a").text)
        i = i+1
        #  이제 여기서 DB에 넣기~ 맨처음 대입이라면, insrt_one , 아니라면 순위에 따라서 doc 바꾸기
        doc = {'rank': i, 'title': title, 'subtitle': subtitle, 'image': image}
        if check_collection is False:
            db.bestSellers.insert_one(doc)
        else:
            db.bestSellers.replace_one({'rank': i}, doc)

crawler()
