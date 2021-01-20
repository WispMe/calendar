import React, {Component} from 'react'
import moment from 'moment'
import Modal from './Modal.js';

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
        time: '',
        invitation: '',
        data: []
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
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleFormSubmit = (e) => {
        e.preventDefault()
        const {title, time, invitation, month, currentDay} = this.state
        const setData = {
            date: `${currentDay} ${month}`,
            title,
            time,
            invitation
        }
        this.setState({
            data: [...this.state.data, setData]
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
    
    render() {
        const {days, allmonths, data} = this.state

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
                // onClick={() => this.handleClick(d, this.state.month)
                <td key={d} className='calendar-day' onClick={() => this.showModal(d)}>
                    <span className={currentDay} style={{fontSize: '12px'}}>{d}</span>
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
                        {data.map((dEvent) => {
                            let eventDay = ''
                            if(dEvent.date === (`${this.state.currentDay} ${this.state.month}`)){
                                eventDay = (
                                    <div className="event" key={dEvent}>
                                        <p>{dEvent.title} ({dEvent.time})</p>
                                        <br/>
                                        <span>{dEvent.invitation}</span>
                                    </div>
                                )
                            }
                            return eventDay
                        })}
                        <div className="d-flex justify-content-center align-items-center flex-column">
                            <p className="titleModal">Add Event</p>
                            <form onSubmit={this.handleFormSubmit}>
                                <input type="text" name="title" placeholder="Title" onChange={this.handleChange}/><br/>
                                <input type="text" name="time" placeholder="Time" onChange={this.handleChange}/><br/>
                                <input type="text" name="invitation" placeholder="Invitation" onChange={this.handleChange}/><br/>
                                <button type="submit" className="primaryButton">Add</button>
                            </form>
                        </div>
                    </div>
                </Modal>  
          </section>
        )
    }
}