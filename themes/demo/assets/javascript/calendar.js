'use strict';

jQuery(function(){
    
    const calendarEl = document.getElementById('calendar');

    const calendar = new FullCalendar.Calendar(calendarEl, {
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
                const events = [];
                const obj = res;
                $(obj.data).each(function(){
                    const dt = new Date(this.date);
                    const end = dt.setHours(dt.getHours() + 2); //TODO: added 2 hour is random
                    const color = getColor(this.status_id);           
                    events.push({
                        title: this.name,
                        start: this.date,
                        end: end,
                        id: this.id,
                        color: color,
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

    
    const STATUSES = {received: 1, approved: 2, closed: 3, cancelled: 4};
    const getColor = (status_id) => {
        let color = null;
        switch (status_id) {
            case STATUSES['received']:
                color = '#3498db';
                break;
            case STATUSES['approved']:
                color = '#27ae60';
                break;
            case STATUSES['closed']:
                color = '#8e44ad';
                break;
            case STATUSES['cancelled']:
                color = '#bdc3c7';
                break;
        }
        return color;
      }
});
