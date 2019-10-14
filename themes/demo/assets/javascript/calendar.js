'use strict';

jQuery(function(){
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [ 'dayGrid','timeGrid' ],
        header: { center: 'dayGridMonth,timeGridWeek,timeGridDay' }, // buttons for switching between views
        defaultView: 'timeGridWeek',
        views: {
            dayGridMonth: {
                //titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' }
            },
            timeGridWeek: { allDaySlot: false },
        },
        events: function (fetchInfo, successCallback, failureCallback) {
            $.ajax({
                type: "GET",
                url: "api/v1/reservations/",
                dataType: "json",                
            }).done(function(res, textStatus, jqXHR){
                var events = [];
                var obj = res;
                $(obj.data).each(function(){
                    var dt = new Date(this.date);
                    var end = dt.setHours(dt.getHours() + 2); //TODO: added 2 hour is random              
                    events.push({
                        title: this.name,
                        start: this.date,
                        end: end,
                        id: this.id,
                        extendedProps: {
                            //TODO: add other attributes
                            email: this.email,
                            phone: this.phone,
                            message: this.message,
                        }
                    });
                });                     
                successCallback(events);
            }).fail(function(jqXHR, textStatus, errorThrown){
                //TODO: add failure process
            });
        },
        eventClick: function(info) {
            const calEvent = info.event;
            $('#modalTitle').html(calEvent.title);
            let modalBody = '';
            $.each(calEvent.extendedProps, function(i, value){
                modalBody += '<li>' + i + ': ' + value + '</li>';
            })
            $('#modalBody').html('<ul>' + modalBody + '</ul>');
            $('#calendarModal').modal();
        },
    });
    //calendar.setOption('locale', 'ja');

    calendar.render();
});
