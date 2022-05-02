import React from 'react';

const CountDownTimer = (props) => {
    const [remainSecond, setRemainSecond] = React.useState(0);

    // effect
    React.useEffect(() => {
        const countDownSecond = props.seconds;

        // 產生 Timer
        console.log(`[timer] == start count down ${countDownSecond}s  ==`);
        const startTime = Date.now();
        const countDownTimer = setInterval(() => {
            // 計算剩餘秒數
            const pastSeconds = parseInt((Date.now() - startTime) / 1000);
            const remain = countDownSecond - pastSeconds;
            setRemainSecond(remain < 0 ? 0 : remain);
            console.log('[timer] count down: ', remain);

            // 檢查是否結束
            if (remain <= 0) {
                clearInterval(countDownTimer);
                console.log(`[timer] == stop count down ${countDownSecond}s  ==`);
                props.onTimeUp(); // 透過 prop 通知外部時間已到
            }
        }, 1000);

        return () => {
            // 清除 Timer
            clearInterval(countDownTimer);
            console.log(`[timer] == stop count down ${countDownSecond}s  ==`);
        };
    }, [props.onTimeUp, props.seconds]); // 相依 prop / state 值的 Effect

    return (
        <div className="tp-count-down-timer">
            <div className="tp-count-down-timer__time">{new Date(remainSecond * 1000).toISOString().substr(11, 8)}</div>
        </div>
    );
};

export default CountDownTimer;
