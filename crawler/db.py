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

    @classmethod
    def query(self,sql):
        try:
            rs = list(db.query(sql))
            return rs
        except Exception as e:
            print e
            return False

    @classmethod
    def insert(self, table, values, debug=False):
        sql = "insert into" + table + \
            "(" + str(values.keys) + ") " + \
            "values (" + str(values.values) + ")"
        try:
            if debug:
                print sql
            self.query(sql)
            return True
        except Exception as e:
            print e
            return False

    @classmethod
    def update(self, table, value, where, debug=False):
        va = ''
        for k,v in value.items():
            if va:
                va += k +"="+ v 
            else:
                va += ","+ k +"="+ v

        sql = "update " + table + " " + \
              "set "+ va + " " + \
              "where "+ where
        try:
            self.query(sql)
            return True
        except Exception as e:
            print e
            return False

    @classmethod
    def delete(self,table,key):
        try:
            db.query(SQL)
            return True
        except Exception as e:
            print e
            return False

    @classmethod
    def dump(self,table):
        try:
            db.query(SQL)
            return True
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

