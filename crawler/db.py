import pymongo
import MySQLdb
from crawler.settings import MONGODB,MYSQLDB,REDISDB
class mysql():
    db = None
    @classmethod
    def open(self):
        if self.db is None:
            self.db=MySQLdb.connection(host=MYSQLDB['host'],user=MYSQLDB["user"],passwd=MYSQLDB["pwd"],db=MYSQLDB['name'])
        return db

    def insert(self, table, value):
        keys = str(value.keys)
        values = str(value.values)
        SQL = "insert " + table + " "
        SQL += str(value.keys) + 
        SQL += "("+ str(value.values) +")"
        try:
            db.query(SQL)
            return True
        except Exception as e:
            print e
            return False

    def update(self, table, key, value):
        SQL = "update " + table + " "
        SQL += "set "
        SQL += "where "
        try:
            db.query(SQL)
            return True
        except Exception as e:
            print e
            return False

    def delete(self,table,key):
        try:
            db.query(SQL)
            return True
        except Exception as e:
            print e
            return False

    def dump(self,table):
        try:
            db.query(SQL)
            return True
        except Exception as e:
            print e
            return False

    def query(self,sql):
        SQL = sql
        try:
            rs = list(db.query(SQL))
            return rs
        except Exception as e:
            print e
            return False

class mongo():
    db = None
    @classmethod
    def get_db(cls):
        if cls.db is None:
            cls.db = pymongo.Connection(MONGODB['host'],MONGODB['port'])[MONGODB['name']]
        return cls.db

    @classmethod
    def open(self):
        if self.db is None:
            self.db = pymongo.Connection(MONGODB['host'],MONGODB['port'])[MONGODB['name']]
        return self.db

    def insert():
        pass
    def update():
        pass
    def delete():
        pass
    def dump():
        pass
    def query():
        return rs

class redis():
    def open():
        pass
    def insert():
        pass
    def update():
        pass
    def delete():
        pass
    def dump():
        pass
    def query():
        return rs

