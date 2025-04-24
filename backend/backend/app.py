from flask import Flask
from flask_cors import CORS
from blueprints.rdfData import rdf_bp
from blueprints.property_structuring import structure_bp
from blueprints.drop_classify import drop_classify_bp

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(structure_bp)
app.register_blueprint(rdf_bp)
app.register_blueprint(drop_classify_bp)


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5001)