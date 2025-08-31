import React from 'react';
import { connect } from 'react-redux';

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    <div key={alert.id} style={getAlertStyle(alert.alertType)}>
      {alert.msg}
    </div>
  ));

const getAlertStyle = (alertType) => {
    const baseStyle = {
        padding: '12px',
        margin: '10px 20px',
        borderRadius: '5px',
        color: 'white',
        textAlign: 'center',
        position: 'fixed',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        minWidth: '300px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    };
    switch(alertType) {
        case 'success':
            return { ...baseStyle, backgroundColor: '#28a745' };
        case 'danger':
            return { ...baseStyle, backgroundColor: '#dc3545' };
        default:
            return { ...baseStyle, backgroundColor: '#6c757d' };
    }
}

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
