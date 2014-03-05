var path = require('path');

var logger = require('./logger.js');
var Storage = require('./storage.js');

function TweetStorage(date){
    this.date = date;
    this.storage = new Storage();
    this.dir = path.normalize(path.resolve(__dirname, '..', 'report', 'twitter'));
}
TweetStorage.prototype = {
    getTweetFilename: function(word){
        return path.join(this.dir, this.date, word) + '.csv';
    },
    createTweetStatistic: function(word){
        var filename = this.getTweetFilename(word);
        var data = 'tweet-id,screen-name,name,user-id,timestamp,time-desc,retweet,favorite\n';
        this.storage.save(filename, data);
    },
    saveTweetStatistic: function(word, tweet){
        var filename = this.getTweetFilename(word);
        if(tweet['tweet-id']){
            tweet['tweet-id'] = 't' + tweet['tweet-id'];
        }
        if(tweet['user-id']){
            tweet['user-id'] = 't' + tweet['user-id'];
        }
        data = [tweet['tweet-id']
            , tweet['screen-name'] || ''
            , tweet['name'] || ''
            , tweet['user-id']
            , tweet.timestamp || ''
            , tweet['time-desc'] || ''
            , tweet.retweet || 0
            , tweet.favorite || 0].join(',') + '\n';
        this.storage.append(filename, data);
    },
    getWordStatisticFilename: function(){
        return path.join(this.dir, this.date) + '.csv';
    },
    createWordStatisticFile: function(callback){
        var filename = this.getWordStatisticFilename();
        var data = 'keyword,retweet index, favorite index\n';
        this.storage.save(filename, data, callback);
    },
    saveWordStatistic: function(statistic){
        var filename = this.getWordStatisticFilename();
        data = [statistic['word'] , statistic['retweet'] || 0 , statistic['favorite'] || 0].join(',') + '\n';
        this.storage.append(filename, data);
    }
};
module.exports = TweetStorage;