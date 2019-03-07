import React from 'react'
import {DragLayer} from "react-dnd";
import {getHeightOfEvent} from "../../helpers/eventToIndexHelper";

const collect = (monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
});

const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
};

function getItemStyles(currentOffset) {
    if (!currentOffset) {
        return {
            display: 'none'
        };
    }

    const { x, y } = currentOffset;
    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform: transform,
        WebkitTransform: transform
    };
}

class EventLayer extends React.Component {
    render() {
        const { item, isDragging, currentOffset, lastHoveredSubCell} = this.props;
        console.log(lastHoveredSubCell);
        console.log(item);
        if (!isDragging) {
            return null
        }
        function renderItem(type, item) {
            switch (type) {
                case "event":
                    return (
                        <EventPreview hoveredSubCell={lastHoveredSubCell} item={item} event={item.event}/>
                    );
                default: return null
            }
        }

        return (
            <div style={layerStyles}>
                <div className='event' style={getItemStyles(currentOffset)}>
                    {renderItem("event", item)}
                </div>
            </div>

        )

    }
}

const getDuration = (event) => {
        const hoursDuration = new Date(event.end).getHours() - new Date(event.start).getHours();
        const minutesDuration = new Date(event.end).getMinutes() - new Date(event.start).getMinutes();
        return {
            hoursDuration,
            minutesDuration
        }
}

const getStart = (subCell, item) => {
        console.log(subCell, item)
        return {
            startHours: subCell.address[0] + item.dayStart,
            startMinutes: subCell.num * item.delimiter
        }
}

const getEnd = (subCell, event, item) => {
        const start = getStart(subCell, item);
        const startDate = new Date(event.start);
        startDate.setHours(start.startHours);
        startDate.setMinutes(start.startMinutes);

        const endDate = new Date(startDate.valueOf());
        endDate.setHours(startDate.getHours() + getDuration(event).hoursDuration);
        endDate.setMinutes(startDate.getMinutes() + getDuration(event).minutesDuration);
        return {
            endHours: endDate.getHours(),
            endMinutes: endDate.getMinutes()
        }
}



const EventPreview = ({ event, hoveredSubCell, item}) => (
        <div className='event-preview' style={{
                background: event.color,
                height: parseInt(getHeightOfEvent(event)) - 2,
            }}>
            <h6>
                {event.title} <br/>
                {hoveredSubCell ?
                    <div>
                        Start: {getStart(hoveredSubCell, item).startHours}:{getStart(hoveredSubCell, item).startMinutes} <br/>
                        End: {getEnd(hoveredSubCell, event, item).endHours}:{getEnd(hoveredSubCell, event, item).endMinutes}
                    </div>
                    :
                    <div>
                        Start: {new Date(event.start).getHours()}:{new Date(event.start).getMinutes()} <br/>
                        End: {new Date(event.end).getHours()}:{new Date(event.end).getMinutes()}
                    </div>
                    }

            </h6>
        </div>
);

export default DragLayer(collect)(EventLayer)