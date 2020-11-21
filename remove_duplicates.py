import json


with open('users.json', 'r') as f:
    l = json.loads(f.read())


''' Creare clasa User pt a implementa __hash__ si __eq__
pt a elimina duplicatele ( facem set )'''
class User:

    def __init__(self, user_dict):
        self.nume = user_dict['nume']
        self.prenume = user_dict['prenume']
        self.data_nastere = user_dict['data_nastere']
        self.localitate = user_dict['localitate']
        self.src = user_dict['src']

    def __hash__(self):
        # facem hash(tuplu_proprietati fara src)
        return hash((self.nume, self.prenume, self.data_nastere, self.localitate))
    
    def __eq__ (self, other):
        if not isinstance(other, User):
            return False
        return (self.nume == other.nume and \
                self.prenume == other.prenume and \
                self.data_nastere == other.data_nastere and \
                self.localitate == other.localitate)

l2 = set()

for i in range(len(l)):
    user_obj = User(l[i])
    l2.add(user_obj)

l2 = list(l2)

print len(l)
print len(l2)


'''
with open('users_unique.json', 'w') as f_unique:
    f_unique.write(json.dumps(l2))
'''



