import React, {Component} from 'react';
import "./faq.css"

class faq extends Component {
    render() {
        return (
            <div id = "faq">
                <h1> Frequently Asked Questions </h1>
                {/*<Question question = "What is Rush?" answer = "Rush is a week long event where Theta Tau showcases what we have to offer as an organization and what we could offer you! It’s a chance to get to know Theta Tau and its members better and see if it is the right fit for you!"/>*/}
                {/*<Question question = "What Majors do Theta Tau accept?" answer = "We accept ALL engineering majors as well as Computer Science and Data Science. Unfortunately, if you are not an engineering major, Computer Science major, or Data Science major, you will not be eligible to receive a bid."/>*/}
                {/*<Question question = "How can I prepare for rush?" answer = "Come with an open mind and be ready to meet lots of people– not just actives, but fellow rushees too! We recommend preparing your resume and updating your LinkedIn before ProDev night, so you can get the best experience possible. Also, it might get cold, since rush can last a while- be sure to bring a jacket! "/>*/}
                {/*<Question question = "What if I have more questions?" answer = "That is the perfect reason to come out to our Rush events! Ask the brothers of Theta Tau any and all of your questions or contact one of our Rush Directors!"/>*/}
                <Question question = "What is rush week?"
                          answer = "Rush Week is a week-long series of events aimed to recruit potential new members into our fraternity. It's an opportunity for you to attend a range of various events to meet current brothers and fellow rushees, learn about the fraternity’s three pillars and atmosphere, and potentially receive an invitation to join! Similarly, it's a chance for the fraternity to meet and get to learn more about you!"
                />
                <Question question = "Why should I rush? What does Theta Tau offer?"
                          answer = "Theta Tau is focused on providing a supportive environment for engineering students, offering professional development, academic support, and a community of like-minded individuals. By joining, you’ll be part of a brotherhood filled with peers and alumni ready to offer mentorship and share in both the challenges and triumphs during and after your college career. If you’re aiming to enhance your leadership abilities, build connections, or find your place in a larger community, you should come out to rush Theta Tau!!"
                />
                <Question question = "Who is eligible to Rush?"
                          answer = "Anyone is welcome to come out to Rush, but you must be an engineering, computer science, or data science major to join the fraternity! We also require a cumulative 2.0 GPA to join the fraternity and have ~$200 payments every two quarters (biannual)."
                />
                <Question question = "I don't have professional clothes, is that okay?"
                          answer = "Dress code is encouraged but not required for Rush. We understand not everyone may have the proper attire, so do not feel pressured by the dress code and wear what you can!"
                />
                <Question question = "What is After Hours?"
                          answer = "After Hours is the time period from when the event ends (around 9 pm) until midnight. After Hours is not required, but encouraged so you can spend more time getting to know the brothers, their experience in Theta Tau, and building an overall stronger connection."
                />
                <Question question = "What happens if I can't attend all the events or am not on time?"
                          answer = "While attending all events is often encouraged to fully engage with the fraternity and its members, it's understood that conflicts can occur. It's okay if you can't attend a specific event, but coming out (even if late) ultimately benefits you in building those connections and helps in potentially receiving an invite to join Theta Tau. However, it is not required to attend every open event to receive an invite."
                />
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


