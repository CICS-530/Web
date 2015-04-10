import requests
import json

class EnvironData():
  def __init__(self):
    self.category_url = "http://pollutantapi-aaroncheng.rhcloud.com/category/index"
    self.disease_url = 'http://pollutantapi-aaroncheng.rhcloud.com/category/getDiseases/'
    self.toxin_url = 'http://pollutantapi-aaroncheng.rhcloud.com/disease/getToxins/'
    self.data = dict()

  def getdata(self, url):
    try:
      r = requests.get(url)
      data = r.json()
      print data
      if isinstance(data, dict) and data.has_key('type'):
        return []
      return data
    except Exception as e:
      return []

  def get_toxin_data(self, disease_name):
    toxin_data = []
    data = self.getdata(self.toxin_url + disease_name)
    if len(data) > 0 and data.has_key('toxins'):
      for item in data['toxins']:
        info = dict()
        info['name'] = item['toxin']
        info['size'] = int(item['evidence_str'])
        toxin_data.append(info)
    return toxin_data

  def get_disease_data(self, category_name):
    disease_data = []
    data = self.getdata(self.disease_url + category_name)
    if len(data) > 0 and data.has_key('diseases'):
      for item in data['diseases']:
        info = dict()
        info['name'] = item['name']
        info['children'] = self.get_toxin_data(item['name'])
        disease_data.append(info)
    return disease_data

  def get_category_data(self):
    category_data = []
    data = self.getdata(self.category_url)
    for item in data:
      info = dict()
      info['name'] = item['Category']['name']
      info['children'] = self.get_disease_data(item['Category']['name'])
      category_data.append(info)
    return category_data

  def get_environ_data(self):
    self.data["name"] = "EnvironmentalDiseases"
    self.data['children'] = self.get_category_data()
    print self.data

  def update_json_file(self):
    with open("environ.json", "w+") as fp:
      json.dump(self.data, fp)

if __name__ == "__main__":
  e = EnvironData()
  e.get_environ_data()
  e.update_json_file()