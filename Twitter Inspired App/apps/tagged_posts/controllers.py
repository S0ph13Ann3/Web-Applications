from py4web import action, request, abort, redirect, URL
from py4web.utils.form import Form
from yatl.helpers import A
from .common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
import re


#Citation: 
# Week 3, 4, 5 lecture notes
#https://py4web.com/_documentation/static/en/chapter-07.html#distinct
#https://py4web.com/_documentation/static/en/chapter-07.html#as-dict-and-as-list
#https://py4web.com/_documentation/static/en/chapter-07.html#find-exclude-sort
#https://py4web.com/_documentation/static/en/chapter-07.html#orderby
#using split: https://py4web.com/_documentation/static/en/chapter-07.html#custom-field-types

@action("index") # http://.../tagged_posts/index -> index() -> {..} -> filter(index.html) -> HTML output
@action.uses("index.html", db, auth.user)
def index():
    posts = db(db.post_item).select(orderby=~db.post_item.created_on, limitby=(0,100))
    return locals()

# a POST api/posts to create a new post from body {content: "..."}.
@action("api/posts", method="POST")
@action.uses(db, auth.user)
def new_post(): 
    post = request.json

    if 'id' in post:
        del post['id']
    if 'created_on' in post:
        del post['created_on']
    if 'created_by' in post:
        del post['created_by']
    
    post_id = db.post_item.validate_and_insert(**post)
    
    tags = re.findall(r"(\#\w+)", post['content'])

    for tag_name in tags:
        db.tag_item.insert(name = tag_name, post_item_id = post_id['id'])
        

    return post_id
  

#a GET api/tags to retrieve all known tags (without duplicates, sorted alphabetically)
@action("api/tags", method="GET")
@action.uses(db)
def all_tags(): 
    #without duplicates
    the_unique_tags = db(db.tag_item).select(db.tag_item.name, distinct = True).as_list()
   
    #sorted alphabetically
    sorted_alpha = []
    for all_tags in sorted(the_unique_tags, key=lambda y: y['name']):
        sorted_alpha.append(all_tags['name'].strip('#'))

    return {"tags":sorted_alpha}
  

#a GET api/posts?tags=x,y,z to retrieve the 100 most recent posts with tags x or y or z (without duplicates).
@action("api/posts", method="GET")
@action.uses(db)
def retrieve_tags(): 
    #?tags=x,y,z to retrieve the 100 most recent posts with tags x or y or z (without duplicates)

    params_list = request.params.get("tags")

    #If no ?tags= specified it should return the 100 most recent
    recent_posts = db(db.post_item).select(db.post_item.content, db.post_item.id, orderby =~db.post_item.created_on, limitby = (0,100))
    list_of_posts = []
    for post in recent_posts:
        if(params_list):
            if any(tag in post["content"] for tag in params_list.split(",")):
                list_of_posts.append(post.as_dict())
        else:
            list_of_posts.append(post.as_dict())
  
    return {"posts":list_of_posts}

#a DELETE api/posts/<post_item_id> delete an item. Only the author can delete items.
@action("api/posts/{post_item_id}", method="DELETE")
@action.uses(db)
def delete_item(post_item_id): 
    deleted_item =  db(db.post_item.id==post_item_id).delete()
    return {"Success":True}