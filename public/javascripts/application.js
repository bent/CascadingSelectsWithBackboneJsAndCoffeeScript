/* DO NOT MODIFY. This file was compiled Sun, 09 Oct 2011 10:35:30 GMT from
 * /Users/bent/Documents/workspace/CascadingSelectsWithBackboneJsAndCoffeeScript/app/coffeescripts/application.coffee
 */

(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $(document).ready(function() {
    var Cities, CitiesView, City, Countries, CountriesView, Country, LocationView, LocationsView, Suburb, Suburbs, SuburbsView, citiesView, countries, countriesView, suburbsView;
    Country = (function() {
      __extends(Country, Backbone.Model);
      function Country() {
        Country.__super__.constructor.apply(this, arguments);
      }
      return Country;
    })();
    City = (function() {
      __extends(City, Backbone.Model);
      function City() {
        City.__super__.constructor.apply(this, arguments);
      }
      City.prototype.urlRoot = 'cities';
      return City;
    })();
    Suburb = (function() {
      __extends(Suburb, Backbone.Model);
      function Suburb() {
        Suburb.__super__.constructor.apply(this, arguments);
      }
      Suburb.prototype.urlRoot = 'suburbs';
      return Suburb;
    })();
    Cities = (function() {
      __extends(Cities, Backbone.Collection);
      function Cities() {
        Cities.__super__.constructor.apply(this, arguments);
      }
      Cities.prototype.model = City;
      return Cities;
    })();
    Countries = (function() {
      __extends(Countries, Backbone.Collection);
      function Countries() {
        Countries.__super__.constructor.apply(this, arguments);
      }
      Countries.prototype.url = 'countries';
      Countries.prototype.model = Country;
      return Countries;
    })();
    Suburbs = (function() {
      __extends(Suburbs, Backbone.Collection);
      function Suburbs() {
        Suburbs.__super__.constructor.apply(this, arguments);
      }
      Suburbs.prototype.model = Suburb;
      return Suburbs;
    })();
    LocationView = (function() {
      __extends(LocationView, Backbone.View);
      function LocationView() {
        LocationView.__super__.constructor.apply(this, arguments);
      }
      LocationView.prototype.tagName = 'option';
      LocationView.prototype.render = function() {
        $(this.el).attr('value', this.model.get('id')).html(this.model.get('name'));
        return this;
      };
      return LocationView;
    })();
    LocationsView = (function() {
      __extends(LocationsView, Backbone.View);
      function LocationsView() {
        this.addAll = __bind(this.addAll, this);
        this.addOne = __bind(this.addOne, this);
        LocationsView.__super__.constructor.apply(this, arguments);
      }
      LocationsView.prototype.events = {
        'change': 'changeSelected'
      };
      LocationsView.prototype.initialize = function() {
        this.collection.bind('reset', this.addAll);
        return this.locationViews = [];
      };
      LocationsView.prototype.addOne = function(location) {
        var locationView;
        locationView = new LocationView({
          model: location
        });
        this.locationViews.push(locationView);
        return $(this.el).append(locationView.render().el);
      };
      LocationsView.prototype.addAll = function() {
        this.locationViews.forEach(function(locationView) {
          return locationView.remove();
        });
        this.locationViews = [];
        this.collection.forEach(this.addOne);
        if (this.selectedId) {
          return $(this.el).val(this.selectedId);
        }
      };
      LocationsView.prototype.changeSelected = function() {
        return this.setSelectedId($(this.el).val());
      };
      LocationsView.prototype.populateFrom = function(url) {
        this.collection.url = url;
        this.collection.fetch();
        return this.setDisabled(false);
      };
      LocationsView.prototype.setDisabled = function(disabled) {
        return $(this.el).attr('disabled', disabled);
      };
      return LocationsView;
    })();
    CountriesView = (function() {
      __extends(CountriesView, LocationsView);
      function CountriesView() {
        CountriesView.__super__.constructor.apply(this, arguments);
      }
      CountriesView.prototype.setSelectedId = function(countryId) {
        this.citiesView.selectedId = null;
        this.citiesView.setCountryId(countryId);
        this.suburbsView.collection.reset();
        return suburbsView.setDisabled(true);
      };
      return CountriesView;
    })();
    CitiesView = (function() {
      __extends(CitiesView, LocationsView);
      function CitiesView() {
        CitiesView.__super__.constructor.apply(this, arguments);
      }
      CitiesView.prototype.setSelectedId = function(cityId) {
        this.suburbsView.selectedId = null;
        return this.suburbsView.setCityId(cityId);
      };
      CitiesView.prototype.setCountryId = function(countryId) {
        return this.populateFrom("countries/" + countryId + "/cities");
      };
      return CitiesView;
    })();
    SuburbsView = (function() {
      __extends(SuburbsView, LocationsView);
      function SuburbsView() {
        SuburbsView.__super__.constructor.apply(this, arguments);
      }
      SuburbsView.prototype.setSelectedId = function(suburbId) {};
      SuburbsView.prototype.setCityId = function(cityId) {
        return this.populateFrom('cities/' + cityId + '/suburbs');
      };
      return SuburbsView;
    })();
    countries = new Countries;
    countriesView = new CountriesView({
      el: $('#country'),
      collection: countries
    });
    citiesView = new CitiesView({
      el: $('#city'),
      collection: new Cities
    });
    suburbsView = new SuburbsView({
      el: $('#suburb'),
      collection: new Suburbs
    });
    countriesView.citiesView = citiesView;
    countriesView.suburbsView = suburbsView;
    citiesView.suburbsView = suburbsView;
    return new Suburb({
      id: 3
    }).fetch({
      success: function(suburb) {
        var cityId;
        suburbsView.selectedId = suburb.id;
        cityId = suburb.get('city_id');
        suburbsView.setCityId(cityId);
        return new City({
          id: cityId
        }).fetch({
          success: function(city) {
            var countryId;
            citiesView.selectedId = city.id;
            countryId = city.get('country_id');
            citiesView.setCountryId(countryId);
            countriesView.selectedId = countryId;
            return countries.fetch();
          }
        });
      }
    });
  });
}).call(this);
