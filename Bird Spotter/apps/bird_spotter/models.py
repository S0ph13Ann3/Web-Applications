from .common import db, Field
from pydal.validators import *
#from pydal.validators import IS_FLOAT, IS_INT, IS_NOT_EMPTY, IS_STRICTLY_POSTIVE
import datetime

db.define_table(
    "bird",
    # a "bird" should have an "id"
    Field("id", "integer", primarykey=True),

    # a "name"
    Field("name", "string", requires=IS_NOT_EMPTY()),

    # an "habitat" (string)
    Field("habitat", "string"), #requires=IS_NOT_EMPTY() , default =""

    # a "weight" (positive number)
    Field("weight", "float", requires=IS_FLOAT_IN_RANGE(minimum=0, maximum=100)),#default=0
    
    # a number of "sightings" (positive number)
    Field("sightings", "integer", requires=IS_INT_IN_RANGE(minimum=0, maximum= 999999999)), #default=0
)

db.commit()
