from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

published_content = []
content_list = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/publish', methods=['POST'])
def publish():
    data = request.get_json()
    title = data.get('title', 'Default Title')  # You may want to provide a way for users to enter a title
    content = data.get('content', '')

    # Insert the new content at the beginning of the content list
    content_list.insert(0, {'title': title, 'content': content})

    return jsonify(success=True)

@app.route('/delete/<int:index>', methods=['DELETE'])
def delete_content(index):
    try:
        del content_list[index]
        return jsonify(success=True)
    except IndexError:
        return jsonify(success=False, error='Index out of range')

@app.route('/get_content')
def get_content():
    return jsonify(content_list)


@app.route('/update/<int:index>', methods=['PUT'])
def update(index):
    try:
        data = request.get_json()  # Get JSON data from the request
        new_content = data.get('content')  # Get the 'content' field from JSON
        published_content[index] = new_content
        return jsonify(success=True)
    except IndexError:
        return jsonify(success=False, error="Index out of range")

if __name__ == '__main__':
    app.run(debug=True)
