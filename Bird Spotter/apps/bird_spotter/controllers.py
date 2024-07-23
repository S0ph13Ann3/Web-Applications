from py4web import action, request, abort, redirect, URL, HTTP, response
from yatl.helpers import A
from .common import db, session, T, cache, logger, flash

#Citation: 
# - https://py4web.com/_documentation/static/en/chapter-07.html
# - https://www.geeksforgeeks.org/response-json-python-requests/

#Went to Mrinal OH on 04/26/24

@action("index")
@action.uses("index.html")
def index():
    # redirect to that URL
    redirect(URL("/bird_spotter/static/index.html"))

# POST endpoint `api/birds` to register a new bird
@action("api/birds", method="POST")
@action.uses(db)
def add_bird():
  
    bird = request.json

    if db(db.bird.name == bird.get('name')).select().first():
        return {"errors": True}

    if 'id' in bird:
        del bird['id']
    
    if 'habitat' not in bird:
        bird["habitat"] = str()
    if 'sightings' not in bird:
        bird["sightings"] = 0
    if 'weight' not in bird:
        bird["weight"] = 0

    bird_id = db.bird.validate_and_insert(**bird)

    return bird_id

#GET endpoint `api/birds` to get birds
@action("api/birds", method="GET")
@action.uses(db)
def get_birds():
    all_birds = db(db.bird).select()
    for bird in all_birds:
        if 'habitat' not in bird or bird['habitat'] == None:
            bird["habitat"] = str()
        if 'sightings' not in bird:
            bird["sightings"] = 0
        if 'weight' not in bird:
            bird["weight"] = 0

    return{"birds": all_birds.as_list()} 


#POST endpoint `api/birds/{id}/increase_sightings` to increase the number of sightings by 1
@action("api/birds/{id}/increase_sightings", method="POST")
@action.uses(db)
def increase_sightings(id):
  
    bird = db(db.bird.id == id).select().first()

    if bird:
        bird.update_record(sightings = bird.sightings +1)
        return {"Success":True}
    else:
        return {"Error": "No sightings"}


#PUT endpoint `api/birds/{id}` to update bird info
@action("api/birds/{id}", method="PUT")
@action.uses(db)
def update_bird(id):
  
    bird_data = request.json

    #if weight is negative
    if float(bird_data['weight']) < 0:
        return {"errors":True}
    
    bird =  db(db.bird.id==id).validate_and_update(**bird_data)
    
    return {"updated":True, "errors":False}

#DELETE endpoint `api/birds/{id}` to delete a bird
@action("api/birds/{id}", method="DELETE")
@action.uses(db)
def delete_bird(id):
     
    deleted_bird =  db(db.bird.id==id).delete()
    return {"Success":True}