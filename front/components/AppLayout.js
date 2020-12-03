import PropTypes from 'prop-types';

const AppLayout = ({ children }) => {
    return (
        <div>
            <div>공통 메뉴</div>
            {children}
        </div>
    )
};

AppLayout.PropTypes= {
    children: PropTypes.node.isRequired,    
    // children: react의 node 타입
    // (화면에 그릴 수 있는 모든 것이 node타입)
}

export default AppLayout;