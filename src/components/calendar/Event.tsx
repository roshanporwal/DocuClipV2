import React from "react"
import moment from "moment"

/**
 * Custom JSX Component to replace the existing one to add ContextMenuTrigger to the event
 *
 * ContextMenuTrigger is used to added a right-click or touchHold trigger to display context
 * menu to access information of the event being triggered
 *
 * @params { event } Event is the event object of big calendar
 */
function Event({ event }: any) {
  const clickEventHandler = (event: any) => {
    const year = moment(event.resource.date).format('YYYY')
    const month = parseInt(moment(event.resource.date).format('MM'))
    const date = moment(event.resource.date).format('DD')

    //window.location.href = "file/" + event.resource.publicName
    window.location.href = `date/${year}_${month-1}_${date}`
  }

  return (
    <span>
      <div onClick={() => clickEventHandler(event)}>
        {event.title}
      </div>
      {/* disabled for onClick event <ContextMenuTrigger id='calendar-context' holdToDisplay={500} collect={() => { return event }} /> */}
    </span>
  )
}

export default Event
