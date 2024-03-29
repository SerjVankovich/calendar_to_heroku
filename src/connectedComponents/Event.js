import { connect } from 'react-redux'
import {clearCollisions, replaceCollisions, resizeEvent} from "../actions/eventActions";
import Event from "../components/Event/Event"
import {switchDrag} from "../actions/dragAction";


const EventConnected = connect(
    state => ({
        collisions: state.collisions,
        lastHoveredSubCell: state.lastHoveredSubCell,
        canDrag: state.canDrag
    }),
    dispatch => ({
        replaceCollisions(event, collisions) { return dispatch(replaceCollisions(event, collisions))},
        clearCollisions(event) { return dispatch(clearCollisions(event))},
        resizeEvent(eventId, incrementedMinutes, offset) { return dispatch(resizeEvent(eventId, incrementedMinutes, offset))},
        switchDrag() {return dispatch(switchDrag())}
    })
)(Event);

export default EventConnected