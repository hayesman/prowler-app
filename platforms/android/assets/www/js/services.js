angular.module('articlesApp')
    .factory('Articles', function($http) {
        return {
            getArticles: function(title, author, body, topic, pub) {
                return $http.get('https://prowler333.herokuapp.com/articles.json?title=' + title + '&author=' 
                    + author + '&body=' + body + '&topic=' + topic + '&publication=' + pub);
            },
            getArticle: function(articleId) {
                return $http.get('https://prowler333.herokuapp.com/articles/' + articleId + '.json');
            },
            getTopics: function() {
                return $http.get('https://prowler333.herokuapp.com/topics.json'); 
            },
            getPublications: function() {
                return $http.get('https://prowler333.herokuapp.com/publications.json');
            }

        }
    });

    angular.module('deepBlue.services', [])


