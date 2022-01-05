from browser import ajax, document, html
import json

def read(r):
    data = r.json
    link = html.A(Href = data['url'])
    link <= html.P(data['url'])
    document["create_result"] <= link
    
def click(ev):
    document["create_result"] <= document["create_input"].value
    ajax.post("https://tinyurl.ga/api", oncomplete = read, data = json.dumps({"url": document["create_input"].value}))

document["create_button"].bind("click", click)