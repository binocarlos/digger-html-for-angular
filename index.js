/*

  we are in private scope (component.io)
  
*/
var template = require('./dist/abn_tree_template');

angular
  .module('digger.html', [
    
  ])



  .directive('diggerHtml', function($safeApply){

    //field.required && showvalidate && containerForm[field.name].$invalid
    return {
      restrict:'EA',
      scope:{
        container:'='
      },
      replace:true,
      template:'<div><digger-htmltree tree-data="treedata" on-select="container_select(branch)" expand-level="depth"></digger-htmltree></div>',
      controller:function($scope){

        $scope.depth = $scope.depth || 4;
        $scope.treedata = [];
        
        $scope.$watch('container', function(container){
          if(!container){
            return;
          }

          container.recurse(function(c){
            c.data('showattributes', true);
          })

          $scope.treedata = container.models;

        })

        $scope.container_select = function(model){
          //$scope.$emit('tree:selected', $scope.container.spawn(model));
        }
      }
    }
  })

  .directive('diggerHtmltree', function($timeout) {
  return {
    restrict: 'E',
    template: template,
    scope: {
      treeData: '=',
      onSelect: '&'      
    },
    link: function(scope, element, attrs) {
      var expand_level, for_each_branch, on_treeData_change, select_branch, selected_branch;
      if (attrs.iconExpand == null) {
        attrs.iconExpand = 'icon-plus';
      }
      if (attrs.iconCollapse == null) {
        attrs.iconCollapse = 'icon-minus';
      }
      if (attrs.iconLeaf == null) {
        attrs.iconLeaf = '';//icon-chevron-right';
      }
      if (attrs.expandLevel == null) {
        attrs.expandLevel = '3';
      }
      expand_level = parseInt(attrs.expandLevel, 10);
      scope.header = attrs.header;
      if (!scope.treeData) {
        alert('no treeData defined for the tree!');
      }
      if (scope.treeData.length == null) {
        if (treeData._digger != null) {
          scope.treeData = [treeData];
        } else {
          alert('treeData should be an array of root branches');
        }
      }
      for_each_branch = function(f) {
        var do_f, root_branch, _i, _len, _ref, _results;
        do_f = function(branch, level) {
          var child, _i, _len, _ref, _results;
          f(branch, level);
          if (branch._children != null) {
            _ref = branch._children;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              child = _ref[_i];
              _results.push(do_f(child, level + 1));
            }
            return _results;
          }
        };
        _ref = scope.treeData;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          root_branch = _ref[_i];
          _results.push(do_f(root_branch, 1));
        }
        return _results;
      };
      for_each_branch(function(b, level) {
        b.level = level;
        return b._data.expanded = b.level < expand_level;
      });


      scope.selectedid = null;

      

      select_branch = function(branch) {
        scope.selectedid = branch._digger.diggerid;
        
        if (branch.onSelect != null) {
          return $timeout(function() {
            return branch.onSelect(branch);
          });
        } else {
          if (scope.onSelect != null) {
            return $timeout(function() {
              return scope.onSelect({
                branch: branch
              });
            });
          }
        }
      };
      scope.$on('tree:reset', function(ev){
        scope.selectedid = null;
      })
      scope.$on('tree:setselected', function(ev, selected){
        scope.selectedid = selected._digger.diggerid;
      })
      scope.user_clicks_branch = function(branch) {
        if (branch !== selected_branch){
          return select_branch(branch);
        }
      };
      scope.togglebranch = function(branch, value){
        branch._data.expanded = arguments.length>1 ? value : !branch._data.expanded; 
        scope.$emit('tree:toggle', branch);
      }
      scope.tree_rows = [];
      on_treeData_change = function() {
        var add_branch_to_list, root_branch, _i, _len, _ref, _results;
        scope.tree_rows = [];
        for_each_branch(function(branch) {
          if (branch._children) {
            if (branch._children.length > 0) {
              return branch._children = branch._children.map(function(e) {
                if (typeof e === 'string') {
                  return {
                    name: e,
                    children: []
                  };
                } else {
                  return e;
                }
              });
            }
          } else {
            return branch._children = [];
          }
        });
        add_branch_to_list = function(level, branch, visible) {
          var child, child_visible, tree_icon, _i, _len, _ref, _results;
          if(!branch._data){
            branch._data = {};
          }
          if (branch._data.expanded == null) {
            branch._data.expanded = false;
          }
          if (!branch._children || branch._children.length === 0) {
            tree_icon = attrs.iconLeaf;
          } else {
            if (branch._data.expanded) {
              tree_icon = attrs.iconCollapse;
            } else {
              tree_icon = attrs.iconExpand;
            }
          }
          var digger = branch._digger || {};
          var classnames = digger.class || [];
          var classst = classnames.join(' ');
          branch._data._classst = classst;

          var cattrs = branch;
          var display_attrs = [];
          for(var prop in cattrs){
            if(prop!='label' && prop.indexOf('_')!=0 && typeof(cattrs[prop])!='object'){
              display_attrs.push({
                value:cattrs[prop],
                title:prop
              })
            }
          }
          branch._data._display_attrs = display_attrs;
          scope.tree_rows.push({
            level: level,
            branch: branch,
            tree_icon: tree_icon,
            visible: visible
          });
          if (branch._children != null) {
            _ref = branch._children;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              child = _ref[_i];
              child_visible = visible && branch._data.expanded;
              _results.push(add_branch_to_list(level + 1, child, child_visible));
            }
            return _results;
          }
        };
        _ref = scope.treeData;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          root_branch = _ref[_i];
          _results.push(add_branch_to_list(1, root_branch, true));
        }
        if(!scope.selectedid && scope.treeData[0] && scope.treeData[0]._digger){
          scope.selectedid = scope.treeData[0]._digger.diggerid;
        }
        return _results;
      };
      
      return scope.$watch('treeData', on_treeData_change, true);
    }
  };
});
