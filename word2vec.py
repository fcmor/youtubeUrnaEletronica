# -*- coding: utf-8 -*-
import gensim, logging, os
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.INFO)
 
class MySentences(object):
    def __init__(self, dirname, fname):
        self.dirname = dirname
        self.fname = fname
    def __iter__(self):
        for line in open(os.path.join(self.dirname, self.fname)):
            yield line.split(',')
 
sentences = MySentences('', 'commentsNoStopWords2.txt') # a memory-friendly iterator
model = gensim.models.Word2Vec(sentences, min_count=6)
print model.similarity('urna', 'fraude')
print model.similarity('urna', 'aranha')
print model.similarity('urna', 'bolsonaro')
print model.similarity('urna', 'lula')
print model.similarity('urna', 'marina')
print model.similarity('urna', 'ciro gomes')
print '\n'
print "Palavras mais prováveis de aparecerem perto de 'bolsonaro': \n"
print model.most_similar(positive=['bolsonaro'], topn=15)
print '\n'
print "Palavras mais prováveis de aparecerem perto de 'diego aranha': \n"
print model.most_similar(positive=['diego', 'aranha'], topn=15)
print '\n'
print "Palavras mais prováveis de aparecerem perto de 'lula': \n"
print model.most_similar(positive=['lula'], topn=25)
print '\n'
print "Palavras mais prováveis de aparecerem perto de 'urna': \n"
print model.most_similar(positive=['urna'], topn=15)

