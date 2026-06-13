import Link from 'next/dist/client/link';
import React from 'react'

interface Props{
    title : string;
    image : string;
    slug : string;
    location : string;
    date:string;
    time:string;
}

const EventCard = ({title , image , slug , location , date , time } : Props) => {
  return (
    <Link href={`/events/${slug}`} id="event-card"  >
      
      <img src={image} alt={title}   height={200} className='poster w-[500] flex'/>
      <div className='flex flex-row gap-2'>
        <img src="/icons/pin.svg" alt="location" width={14} height={14} />
        <p>{location}</p>
      </div>
      <p className='title'>{title}</p>
      <div className='datetime'>
        <div>
                  <img src="/icons/calendar.svg" alt="date" width={14} height={14} />
                  <p>{date}</p>

        </div>
          <div>
                  <img src="/icons/clock.svg" alt="time" width={14} height={14} />
                  <p>{time}</p>

        </div>
      </div>
       </Link>
  )
}

export default EventCard