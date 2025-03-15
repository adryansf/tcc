from . import db

def startDatabaseTransaction():
  db.transaction()

def endDatabaseTransaction():
  try:
    db.commit()
    return True
  except:
    db.rollback()
    return False