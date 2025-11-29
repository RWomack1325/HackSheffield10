import psycopg2

conn = psycopg2.connect(database="postgres",
                        host="localhost",
                        user="postgres",
                        password="mysecretpassword",
                        port="5432")

cursor = conn.cursor()

# cursor.execute("""
#     CREATE TABLE Test (
#         characterID int,
#         characterName varchar(16)
#     );
# """)
# conn.commit()
# cursor.execute("""
#     INSERT INTO Test (characterID, characterName)
#     VALUES (6, 'Emmy');
# """)
# conn.commit()

cursor.execute("""
    drop table sessions cascade;
""")

# cursor.execute("""
#     select * from sessions;
# """)

conn.commit()
#cursor.execute("SELECT * FROM Test WHERE characterID = 6")
#print(cursor.fetchall())

#print(cursor.fetchone())

conn.close()