import React from 'react';
const CountDownTimer = (props) => {
    const [remainSecond, setRemainSecond] = React.useState(0);
    const [stopNum, setStopNum] = React.useState(0);
    const countNumDiv = React.useRef(null);
    const stopNumDiv = React.useRef(null);
    const [progress, setProgress] = React.useState(0);

    const [animation, setAnimation] = React.useState(0);
    let toggle = false;

    // effect
    React.useEffect(() => {
        if (props.isCount) {
            const countDownSecond = props.seconds;
            // 產生 Timer
            console.log(`[timer] == start count down ${countDownSecond}s  ==`);
            const startTime = Date.now();
            const countDownTimer = setInterval(() => {
                // 計算剩餘秒數
                const pastSeconds = parseInt((Date.now() - startTime) / 1000);
                const remain = countDownSecond - pastSeconds;
                setRemainSecond(remain < 0 ? 0 : remain);
                setProgress((100 / props.seconds) * remain - 100);
                console.log('[timer] count down: ', remain);
                toggle = !toggle;
                if (toggle) {
                    setAnimation(1);
                } else {
                    setAnimation(0);
                }
                // 檢查是否結束
                if (remain <= 0) {
                    clearInterval(countDownTimer);
                    console.log(`[timer] == stop count down ${countDownSecond}s  ==`);
                    props.onTimeUp(); // 透過 prop 通知外部時間已到
                    countNumDiv.current.style.visibility = 'hidden';
                    stopNumDiv.current.style.display = 'block';
                }
            }, 1000);

            return () => {
                // 清除 Timer
                clearInterval(countDownTimer);
                console.log(`[timer] == stop count down ${countDownSecond}s  ==`);
            };
        }
    }, [props.seconds, props.isCount]); // 相依 prop / state 值的 Effect

    return (
        <p id="pop" animation={animation}>
            {remainSecond ? remainSecond : null}
        </p>
    );
};

export default CountDownTimer;
