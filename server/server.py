from flask import Flask, request
import json
from datetime import datetime
app = Flask(__name__)


@app.route("/save", methods=['POST'])
def save():
    current = datetime.now()
    current_time = current.strftime("%Y%m%d%H%M%S")
    data = request.get_json()
    rst = data['msgs']
    with open(f'result/{current_time}.json', 'w') as f:
        json.dump(rst, f, indent=4, ensure_ascii=False)
    return {'status': 200, 'count': data['count']}

if __name__ == '__main__':
    app.run()