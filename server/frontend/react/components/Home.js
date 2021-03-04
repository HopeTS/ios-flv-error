import React from 'react';
import axios from 'axios';

import VideoPlayer from './components/VideoPlayer';

export class Home extends React.Component {
    constructor(props) {
        super(props);
    };

    componentWillMount() {
        this.props.page_ID__Set('Home');

    };

    render() {
        return (
            <div id="Home">
                <section className="Home__header">
                    <div className="Home__headerContent">
                        
                    </div>
                </section>

                <section className="Home__content">
                    <div className="Home__contentImage">
                        <img 
                            src="/dist/images/castamatch_2.png" 
                            alt="Castamatch"
                        />
                    </div>
                    <div className="Home__contentText">
                        <VideoPlayer />
                    </div>
                </section>
            </div>
        );
    };
};

export default Home;