from .common import db, Field, auth #might not need SQLDB
from pydal.validators import *
#from pydal.validators import IS_FLOAT, IS_INT, IS_NOT_EMPTY, IS_STRICTLY_POSTIVE
import datetime

db.define_table(
    "post_item",

    # a "post" should have an "id"
    Field("id", "integer", primarykey=True),

    # must have a content
    Field("content", "string", requires=IS_NOT_EMPTY()),

    #post created on
    Field("created_on", "datetime", readable=False, writable=False, default=lambda:datetime.datetime.now()),

    # post created by using an auth.signature
    Field("created_by", "reference auth_user",  readable=False, writable=False,  default=lambda:auth.user_id),
)

db.define_table(
    "tag_item",
    # a name
    Field("name", "string", requires=IS_NOT_EMPTY()),

    # a post_item_id which references a post_item
    Field("post_item_id", "reference post_item"),
)

db.commit()
