import React from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
const CountDownTimer = (props) => {
  const [remainSecond, setRemainSecond] = React.useState(0);
  const countNumDiv = React.useRef(null);
  const stopNumDiv = React.useRef(null);
  const [progress, setProgress] = React.useState(0);
  const [animation, setAnimation] = React.useState(0);
  let toggle = false;

  // effect
  React.useEffect(() => {
    if (props.isCount) {
      countNumDiv.current.style.display = 'block';
      countNumDiv.current.style.visibility = 'visible';
      const timer = setInterval(() => {
        setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
      }, 800);

      clearInterval(timer);
      ///////
      stopNumDiv.current.style.display = 'none';
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
  }, [props.onTimeUp, props.seconds, props.isCount]); // 相依 prop / state 值的 Effect

  return (
    <div className="tp-count-down-timer">
      <div className="tp-count-down-timer__time" ref={countNumDiv}>
        錄製中...你還有
        <div className="countNumCircle">
          <Stack spacing={4} direction="row" className="countNumCircle-item">
            <CircularProgress variant="determinate" value={progress} />
          </Stack>
          <p id="pop" animation={animation} className="countNumCircle-item countNumCircle-item-num">
            {remainSecond}
          </p>
        </div>
        秒闡述想法
      </div>

      <div ref={stopNumDiv} style={{ display: 'none' }}>
        超過30秒囉，或許可以再精簡一點？
      </div>
    </div>
  );
};

export default CountDownTimer;
