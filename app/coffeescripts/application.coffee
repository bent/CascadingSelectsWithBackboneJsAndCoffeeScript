$(document).ready ->
    class Country extends Backbone.Model
    
    class City extends Backbone.Model
        urlRoot: 'cities'
        
    class Suburb extends Backbone.Model
        urlRoot: 'suburbs'
        
    class Cities extends Backbone.Collection
        model: City
        
    class Countries extends Backbone.Collection
        url: 'countries'
        model: Country    
        
    class Suburbs extends Backbone.Collection
        model: Suburb
        
    class LocationView extends Backbone.View
        tagName: 'option'
        
        render: ->
            $(@el).attr('value', @model.get('id')).html @model.get('name')
            return @
            
    class LocationsView extends Backbone.View
        events: 
            'change':'changeSelected'
        
        initialize: ->
            @collection.bind 'reset', @addAll
            @locationViews = []
            
        addOne: (location) =>
            locationView = new LocationView model: location
            @locationViews.push locationView
            $(@el).append locationView.render().el
            
        addAll: =>
            @locationViews.forEach (locationView) ->
                 locationView.remove()
                 
            @locationViews = []
            @collection.forEach @addOne
            
            if (@selectedId)
                $(@el).val @selectedId
        
        changeSelected: ->
            @setSelectedId $(@el).val()
            
        populateFrom: (url) ->
            @collection.url = url
            @collection.fetch()
            @setDisabled false
            
        setDisabled: (disabled) ->
            $(@el).attr 'disabled', disabled
    
    class CountriesView extends LocationsView
        setSelectedId: (countryId) ->
            @citiesView.selectedId = null
            @citiesView.setCountryId countryId
            
            @suburbsView.collection.reset()
            suburbsView.setDisabled true
            
    class CitiesView extends LocationsView
        setSelectedId: (cityId) ->
            @suburbsView.selectedId = null;
            @suburbsView.setCityId cityId
            
        setCountryId: (countryId) ->
            @populateFrom "countries/" + countryId + "/cities"            

    class SuburbsView extends LocationsView
        setSelectedId: (suburbId) ->
        
        setCityId: (cityId) ->
            @populateFrom 'cities/' + cityId + '/suburbs'

    countries = new Countries
    
    countriesView = new CountriesView el: $('#country'), collection: countries
    citiesView = new CitiesView el: $('#city'), collection: new Cities
    suburbsView = new SuburbsView el: $('#suburb'), collection: new Suburbs
    
    countriesView.citiesView = citiesView
    countriesView.suburbsView = suburbsView
    citiesView.suburbsView = suburbsView
    
    new Suburb(id:3).fetch(success: (suburb) ->
        suburbsView.selectedId = suburb.id
        cityId = suburb.get 'city_id'
        suburbsView.setCityId cityId
        
        new City(id: cityId).fetch(success: (city) ->
            citiesView.selectedId = city.id
            countryId = city.get 'country_id'
            citiesView.setCountryId countryId
            
            countriesView.selectedId = countryId
            countries.fetch()
        )
    )