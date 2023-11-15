import React from 'react';

class Error extends React.Component<{ statusCode: any }> {
    static getInitialProps: ({res, err}: { res: any; err: any }) => { statusCode: any };
    render() {
        let {statusCode} = this.props;
        return (
            <p>
                {statusCode
                    ? `An error ${statusCode} occurred on server`
                    : 'An error occurred on client'}
            </p>
        );
    }
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
