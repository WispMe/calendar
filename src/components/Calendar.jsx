import React, {Component} from 'react'
import moment from 'moment'
import Modal from './Modal.jsx'

// import 'rc-time-picker/assets/index.css';
import TimePicker from 'rc-time-picker';

export default class Calendar extends Component{
    state = {
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        dateObject: moment(),
        allmonths: moment.months(),
        month: '',
        currentDay: '',
        todayMonth: '',
        show: false,
        title: '',
        time: [],
        startTime: '00:00',
        endTime: '00:00',
        invitation: '',
        eventCount: 0,
        data: [],
        format: 'HH:mm',
        showEdit: false,
        editEvent: '',
        titleEdit: '',
        invitationEdit: '',
        timeEdit: [],
        startTimeEdit: '',
        endTimeEdit: '',
        addDisabled: false
    }

    componentDidMount(){
        const data = JSON.parse(localStorage.getItem('data'));
        this.setState({
            month: this.state.dateObject.format("MMMM"),
            todayMonth: this.state.dateObject.format("MMMM")
        })
        if(localStorage.getItem('data')){
            this.setState({
                data
            })
        }
    }

    firstDayOfMonth = () => {
        let dateObject = this.state.dateObject;
        let firstDay = moment(dateObject)
                     .startOf("month")
                     .format("d"); 
       return firstDay;
    };

    daysInMonth = () => { 
            let dateObject = this.state.dateObject;
            return moment(dateObject).daysInMonth()
        }
    
    currentDay = () => {  
        return this.state.dateObject.format("D");
    }

    month = () => {
        return this.state.dateObject.format("MMMM");
        };

    setMonth = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        }, () =>{
            let monthNo = this.state.allmonths.indexOf(this.state.month);// get month number 
            let dateObject = Object.assign({}, this.state.dateObject);
            dateObject = moment(dateObject).set("month", monthNo); // change month value
            this.setState({
                dateObject: dateObject // add to state
            });

        })
    };

    
    // Modal

    changeStartTime = (value) => {
        if(value === null){
            this.setState({
                startTime: ''
            })
        }else{
            this.setState({
                startTime: value.format(this.state.format)
            })
        }
    }

    changeEndTime = (value) => {
        if(value === null){
            this.setState({
                endTime: ''
            })
        }else{
            this.setState({
                endTime: value.format(this.state.format)
            })
        }
    }

    changeStartTimeEdit = (value) => {
        if(value === null){
            this.setState({
                startTimeEdit: ''
            })
        }else{
            this.setState({
                startTimeEdit: value.format(this.state.format)
            })
        }
    }

    changeEndTimeEdit = (value) => {
        if(value === null){
            this.setState({
                endTimeEdit: ''
            })
        }else{
            this.setState({
                endTimeEdit: value.format(this.state.format)
            })
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleDelete = (sEvent) => {
        let dataTemp = this.state.data
        let newData = []
        dataTemp.map((dEvent) => {
            if(dEvent === sEvent){
                
            }else{
                newData.push(dEvent)
            }
            return newData
        })
        this.setState({
            data: newData
        }, () => {
            localStorage.setItem('data',JSON.stringify(this.state.data));
        })
        
    }

    handleFormSubmitEdit = (sEvent) => {

        let dataTemp = this.state.data
        let newData = []

        dataTemp.map((dEvent) => {
            if(dEvent === sEvent){
                const {titleEdit, invitationEdit, month, currentDay, startTimeEdit, endTimeEdit} = this.state

                const setData = {
                    date: `${currentDay} ${month}`,
                    title: titleEdit,
                    time: [startTimeEdit, endTimeEdit],
                    invitation: invitationEdit
                }

                newData.push(setData)
            }else{
                newData.push(dEvent)
            }
            return newData
        })
        this.setState({
            data: newData,
            titleEdit: '',
            invitationEdit: '',
            startTimeEdit: '',
            endTimeEdit: '',
        }, () => {
            localStorage.setItem('data',JSON.stringify(this.state.data));
        })


    }

    handleFormSubmit = (e) => {
        e.preventDefault()
        const {title, invitation, month, currentDay, startTime, endTime} = this.state

        const setData = {
            date: `${currentDay} ${month}`,
            title,
            time: [startTime, endTime],
            invitation
        }
        this.setState({
            data: [...this.state.data, setData],
            title: '',
            time: '',
            invitation: ''
        }, () => {
            localStorage.setItem('data',JSON.stringify(this.state.data));
        })

      };

    showModal = (d) => {
        this.setState({
            show: true,
            currentDay: d
        });
      };
    
      hideModal = () => {
        this.setState({ show: false });
      };

      showModalEdit = (dEvent) =>{
        this.setState({
            showEdit: true,
            titleEdit: dEvent.title,
            invitationEdit: dEvent.invitation,
            startTimeEdit: dEvent.time[0],
            endTimeEdit: dEvent.time[1]
        })
      }

      hideModalEdit = () => {
        this.setState({ showEdit: false });
      };
    
    render() {
        const {days, allmonths, data, title, invitation} = this.state
        const now = moment().hour(0).minute(0);
        var eventCount = 0

        let blanks = [];
        for (let i = 0; i < this.firstDayOfMonth(); i++) {
            blanks.push(
                <td className="calendar-day empty">{""}</td>
            );
        }

        let daysInMonth = [];
        for (let d = 1; d <= this.daysInMonth(); d++) {
            let currentDay = (d === Number(this.currentDay()) && this.state.todayMonth === this.month() ? "today" : "");   
            daysInMonth.push(
                <td key={d} className='calendar-day' onClick={() => this.showModal(d)}>
                    <span className={currentDay} style={{fontSize: '12px'}}>{d}</span>
                    <div className="d-flex flex-column" style={{height: "80%"}}>
                        {data.map((dEvent) => {
                                let eventDay = ''
                                if(dEvent.date === (`${d} ${this.state.month}`)){
                                    eventDay = (
                                        <div key={dEvent.title} className="eventDay" style={{height: "100%"}}>
                                            <p>{dEvent.title} ({dEvent.time[0]} - {dEvent.time[1]})</p>
                                        </div>
                                    )
                                }
                                return eventDay
                            })}
                    </div>
                </td>
            );
        }

        let blanksLast = [];
        const totalDaysinCalendar = Number(this.firstDayOfMonth()) + Number(this.daysInMonth())
        for (let i = totalDaysinCalendar; i < 42; i++) {
            blanksLast.push(
                <td className="calendar-day empty">{""}</td>
            );
        }

        var totalSlots = [...blanks, ...daysInMonth, ...blanksLast];
        let rows = [];
        let cells = [];

        totalSlots.forEach((row, i) => {
            if (i % 7 !== 0) {
              cells.push(row); // if index not equal 7 that means not go to next week
            } else {
              rows.push(cells); // when reach next week we contain all td in last week to rows 
              cells = []; // empty container 
              cells.push(row); // in current loop we still push current row to new container
            }
            if (i === totalSlots.length - 1) { // when end loop we add remain date
              rows.push(cells);
            }
          });
        
        let daysinmonth = rows.map((d, i) => {
            return <tr>{d}</tr>;
          });
        

        return (
            <section className="calendar">
                <div className="calendar-content d-flex justify-content-center align-items-center flex-column">
                    <h1 style={{fontSize: "34px"}}>Calendar 2021</h1>
                    <div className="month">
                        <select name="month" id="month" onChange={this.setMonth}>
                            {allmonths.map((month) =>{
                                let selected = (month === this.month() ? "selected" : "")
                                return(
                                    <option value={month} key={month} selected={selected}>{month}</option>
                                )
                            } 
                            
                            )}
                        </select>
                    </div>
                    <br/>
                    <table className="table table-bordered" style={{width: "120%"}}>
                        <thead>
                            <tr style={{textAlign: "center"}}>
                                {days.map((day) => {
                                    return(<th key={day} style={{width: "200px"}}>{day}</th>)
                                })
                                }
                            </tr>
                        </thead>
                        <tbody>{daysinmonth}</tbody>
                    </table>
                </div> 
                <Modal show={this.state.show} handleClose={this.hideModal}>
                    <div>
                        <p className="dateModal">{this.state.currentDay} {this.state.month}</p>
                    </div>
                    <div className="line"></div>
                    <div>
                        <p className="titleModal">Events</p>
                        {data.map((dEvent, id) => {
                            let eventDay = ''
                            if(dEvent.date === (`${this.state.currentDay} ${this.state.month}`)){
                                eventCount++
                                eventDay = (
                                    <div className="event" key={id}>
                                        <span onClick={() => this.showModalEdit(dEvent)} className="edit">Edit</span>
                                        <span onClick={() => this.handleDelete(dEvent)} className="delete">x</span>
                                        <p>{dEvent.title} ({dEvent.time[0]} - {dEvent.time[1]})</p>
                                        <br/>
                                        <div className="invitation">
                                            <p>Who:</p>
                                            <ul>
                                                <li style={{paddingLeft: "20px"}}>{dEvent.invitation}</li>
                                            </ul>
                                        </div>
                                        <Modal show={this.state.showEdit} handleClose={this.hideModalEdit}>
                                            <div>
                                                <p className="titleModal">Edit Event</p>
                                                <div className="line"></div>
                                                <form onSubmit={() => this.handleFormSubmitEdit(dEvent)} className="d-flex justify-content-center align-items-center flex-column">
                                                    <div className="div-input">
                                                        <span>Title&ensp;&ensp;: </span>
                                                        <input type="text" name="titleEdit" placeholder="Title" value={this.state.titleEdit} onChange={this.handleChange}/><br/>
                                                    </div>
                                                    <div className="div-input">
                                                        <span>Time&ensp;&ensp;: </span>
                                                        <TimePicker
                                                            showSecond={false}
                                                            defaultValue={moment().hour(Number(dEvent.time[0].substr(0, 2))).minute(Number(dEvent.time[0].substr(3, 2)))}
                                                            className="xxx"
                                                            onChange={this.changeStartTimeEdit}
                                                            inputReadOnly
                                                        />
                                                        <span> to </span>
                                                        <TimePicker
                                                            showSecond={false}
                                                            defaultValue={moment().hour(Number(dEvent.time[1].substr(0, 2))).minute(Number(dEvent.time[1].substr(3, 2)))}
                                                            className="xxx"
                                                            onChange={this.changeEndTimeEdit}
                                                            inputReadOnly
                                                        />
                                                        <br/>
                                                    </div>
                                                    <div className="div-input">
                                                        <span>Invite&ensp;: </span>
                                                        <input type="text" name="invitationEdit" placeholder="Invite" value={this.state.invitationEdit} onChange={this.handleChange}/><br/>
                                                    </div>
                                                    <button type="submit" className="primaryButton">Edit</button>
                                                </form>
                                            </div>
                                        </Modal>
                                    </div>
                                )
                            }
                            return eventDay
                        })}
                        <div className="line"></div>
                        <div className="d-flex justify-content-center align-items-center flex-column">
                            <p className="titleModal">Add Event</p>
                            <form onSubmit={this.handleFormSubmit} className="d-flex justify-content-center align-items-center flex-column">
                                <div className="div-input">
                                    <span>Title&ensp;&ensp;: </span>
                                    <input type="text" name="title" placeholder="Title" value={title} onChange={this.handleChange}/><br/>
                                </div>
                                <div className="div-input">
                                    <span>Time&ensp;&ensp;: </span>
                                    <TimePicker
                                        showSecond={false}
                                        defaultValue={now}
                                        className="xxx"
                                        onChange={this.changeStartTime}
                                    />
                                    <span> to </span>
                                    <TimePicker
                                        showSecond={false}
                                        defaultValue={now}
                                        className="xxx"
                                        onChange={this.changeEndTime}
                                    />
                                    <br/>
                                </div>
                                <div className="div-input">
                                    <span>Invite&ensp;: </span>
                                    <input type="text" name="invitation" placeholder="Invite" value={invitation} onChange={this.handleChange}/><br/>
                                </div>
                                <button type="submit" className="primaryButton" disabled={eventCount < 3 ? false : true}>Add</button>
                            </form>
                        </div>
                    </div>
                </Modal>  
          </section>
        )
    }
}