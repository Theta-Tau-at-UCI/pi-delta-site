import React, {Component} from 'react';
import "./faq.css"

class faq extends Component {
    render() {
        return (
            <div>
                <h1> Frequently Asked Questions </h1>
                <Question question = "What is Rush?" answer = "Rush is a week long event where Theta Tau showcases what we have to offer as an organization and what we could offer you! It’s a chance to get to know Theta Tau and its members better and see if it is the right fit for you!"/>
                <Question question = "What Majors do Theta Tau accept?" answer = "We accept ALL engineering majors as well as Computer Science. Unfortunately, if you are not an engineering major or a Computer Science major, you will not be eligible to receive a bid."/>
                <Question question = "What if I have more questions?" answer = "That is the perfect reason to come out to our Rush events! Ask the brothers of Theta Tau any and all of your questions or contact one of our Rush Directors!"/>
            </div>
        );
    }
}


class Question extends React.Component<{question: string, answer: string}, {}> {
    render(){
        return (
            <div className = "question">
                <ul> <li> <h3> {this.props.question}</h3> </li> </ul>
                <p className = "faq-answers"> {this.props.answer}</p>
            </div>

        );
    }
}



export default faq;


