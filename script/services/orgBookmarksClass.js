sfobApp.factory('OrgBookmarks',['$q', 'utils', 'Bookmark', function($q, utils, Bookmark, OrgBookmarks) {

	const DEFAULT_GROUP = 'Default';
	const NEW_GROUP = 'New Group';

	var orgBookmarksBase = {
		/*			data:
		orgId: null,
		name: null,
		groups: [
			{
				name: 'default',
				createdDate: '',
				bookmarks: []
			}
		],
		bookmarks: [],	- deprecated
		*/

		toDataOnly: function() {
			return {
				orgId: this.orgId,
				name: this.orgId
			};
		},

		addGroup: function(name) {
			var newGroup = {
				name: name || NEW_GROUP,
				createdDate: new Date(),
				bookmarks: []
			};
			this.groups.push(newGroup);
			return newGroup;
		},

		deleteGroup: function(index) {
			delete this.groups[index];
		},

		getDefaultGroup: function() {
			this.groups = this.groups || [];
			var groups = this.groups;

			if (groups.length == 0) {
				this.addGroup(DEFAULT_GROUP);
				return groups[0];
			}

			var defaultGroup = groups[0];
			angular.forEach(groups, function(group) {
				if (group.name == DEFAULT_GROUP) {
					defaultGroup = group;
				}
			});
			return defaultGroup;
		},

		/*getGroupsNames: function() {
			return utils.getValues(this.groups, 'name');
		},*/

		//---------------- Bookmarks methods -------------------------

		getIndex: function(group, bookmark) {
			return group.bookmarks.indexOf(bookmark);
		},

		addBookmark: function(title, url) {
			var bookmark = new Bookmark(null, title, url);
			var defaultGroup = this.getDefaultGroup();
			defaultGroup.bookmarks.push(bookmark);
		},

		deleteBookmark: function(group, bookmark) {
			//var group = this.groups[groupIndex];
			var index = this.getIndex(group, bookmark);
			group.bookmarks.splice(index, 1);
		},

		moveBookmark: function(group, bookmark, shift) {
			var index = this.getIndex(group, bookmark);
	        var success = utils.switchItems(group.bookmarks, index, index + shift);
	        return success;
	    },

	    moveBookmarkToGroup(bookmark, oldGroup, newGroup) {
	    	newGroup.bookmarks.push(bookmark);
	    	this.deleteBookmark(oldGroup, bookmark);
	    },
	};

	var orgBookmarksObj;

	/*function contains(bookmarks, title, url) {
        for (var i=0; i<bookmarks.length; i++) {
            if (bookmarks[i].title == title && bookmarks[i].url == url) {
                return true;
            }
        }
    }*/

	return function(orgBookmarks, orgId) {

		orgBookmarks = orgBookmarks || { orgId: orgId };

		// copy functionality into object
		angular.merge(orgBookmarks, orgBookmarksBase);

		orgBookmarks.orgId = orgBookmarks.orgId || orgId;

		// clean groups and bookmarks
		orgBookmarks.groups = utils.removeEmptyItems(orgBookmarks.groups);

		// set groups map
		//orgBookmarks.groupsMap = {};
		angular.forEach(orgBookmarks.groups, function(group) {
			//orgBookmarks.groupsMap[group.name] = group;
			if (!group.createdDate) {
				group.createdDate = new Date();
			}
		});

		// arrange old bookmarks into default group
		if (orgBookmarks.bookmarks) {
			angular.forEach(orgBookmarks.bookmarks, function(bookmark) {
				orgBookmarks.addBookmark(bookmark.title, bookmark.url);
			});
			delete orgBookmarks.bookmarks;
		}

		return orgBookmarks;
	};

}]);