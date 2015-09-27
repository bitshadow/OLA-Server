// App js
(function() {
    var go = 'running!';

    function nano(template, data) {
      return template.replace(/\{([\w\.]*)\}/g, function(str, key) {
        var keys = key.split("."), v = data[keys.shift()];
        for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
        return (typeof v !== "undefined" && v !== null) ? v : "";
      });
    }
    
    function populateDom(data) {
        if (!data.ride_estimate && data.message) {
            var $alert = $('.alert');
            $alert.attr('class', 'alert alert-danger');
            $alert.text(data.message.toUpperCase());
            return;
        }

        var container = $('.container');
        $('.top-spinner').hide();
        $('.ola-btn').removeClass('hide');
        $('.button-spinner').addClass('hide');

        var $ul = $('<ul class="nav nav-tabs"></ul>');
        var $content = $('<div class="tab-content"></div>');
        data.ride_estimate.forEach(function(e, i) {
            var bool = i == 0;
            var li = '<li class="' + (bool ? "active" : "") + '" name="' + e.category + '"><a data-toggle="tab" id="tab-'+ e.category +'" href="#' + e.category +'"></a></li>';
            $ul.append(li);

            var strActive = bool ? "active in" : "";
            var table = nano('<table id="bookingDetailsTable" style="width:100%;"><tbody><tr><td class="descLabel">Car Category:</td><td class="descValue" id="car_category">{e.category}</td></tr><tr><td class="descLabel">Usage:</td><td class="descValue">City Taxi</td></tr><tr><td class="distLabel">Total Distance:</td><td class="descValue">{e.distance}</td></tr><tr><td class="amtLabel">Min Amount:</td><td class="amtValue">Rs {e.amount_min}</td></tr><tr><td class="distLabel">Max Amount :</td><td class="descValue"> Rs {e.amount_max}</td></tr</tbody></table>', { e: e });
            var str = '<div id="'+ e.category +'" class="tab-pane fade '+ strActive +'">'+ table +'</div>';
            $content.append(str);            
        });

        container.append($content);
        $ul.insertBefore('.tab-content');
    }

    function setBookingStatus(data) {
        console.log('data: ', JSON.stringify(data));
        var container = $('.container');
        $('.button-spinner').addClass('hide');
        var $alert = $('.alert')
        if (data.status === 'FAILURE') {
            $alert.attr('class', 'alert alert-danger');
            $alert.text('SORRY, '+ data.code.split('_').join(' ') + '. PLEASE TRY AGAIN LATER.');
            $('.ola-btn').removeClass('hide');
        } else if (data.crn) {
            $alert.attr('class', 'alert alert-success');
            $alert.text('Your cab is in your way. Happy Journey!')
            data.driver_name = data.driver_name === '' ? 'Unknown' : data.driver_name; 
            data.driver_number = data.driver_number === '' ? 'Unknown' : data.driver_number;
            data.cab_number = data.cab_number === '' ? 'Not Available' : data.cab_number;
            var table = nano('<table id="bookedDetailsTable" style="width:100%;"><tbody><tr><td class="name">Driver Name:</td><td>{data.driver_name}</td></tr><tr><td class="number">Phone No:</td><td>{data.driver_number}</td></tr><tr><td class="type">Cab Type:</td><td>{data.cab_type}</td></tr><tr><td class="car_model">Car Model:</td><td>{data.car_model}</td></tr><tr><td class="cab_number">Car Number:</td><td>{data.cab_number}</td></tr><tr><td class="car_number">ETA:</td><td>{data.eta} Minutes</td></tr></tbody></table>', {data: data});
            container.html(table);            
        }
    }

    function bookOla() {
        // var selectedCategory = $();
        var $li = $('li.active');
        var category = $li.attr('name');

        var obj = window.location.search + '&category=' + category;
        $.ajax({
            url: '/book',
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                obj: obj
            }),
            success: function(data) {
                setBookingStatus(data);
            }
        });

        $('.ola-btn').addClass('hide');
        $('.button-spinner').removeClass('hide');

    }

    function getEstimate() {
        var obj = window.location.search;
        $.ajax({
            url: '/estimate',
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                obj: obj
            }),
            success: function(data) {
                populateDom(data);
            }
        });
    }

    window.onload = function() {
        var $bookButton = $('.ola-btn');
        $bookButton.on('click', bookOla);

        getEstimate();
    }
})();
    