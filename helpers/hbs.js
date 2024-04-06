const moment = require('moment');

module.exports = {
    formatDate: function(date, format) {
        return moment(date).format(format);
    },
    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '')
    },
    truncate: function(str, len) {
        if(str.length > 0 && str.length > len) {
            let newStr = '';
            newStr = str.substr(0, len)
            return newStr+'...'
        }
        return str
    },
    editIcon: function(storyUser, loggedInUser, storyId, floating = true) {
        if(storyUser._id.toString() == loggedInUser._id.toString()) {
            if(floating)
                return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-small fa-edit"></i></a>`
            else 
                return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
        }
        else return ''
    },
    isSelected: function (selected, val) {
        return selected === val ? "selected=selected" : ""
    }
}