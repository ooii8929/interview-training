const { useState } = React;

const styles = {
  transition: "all 1s ease-out",
};

function App() {
  const [presenters, setPresenters] = React.useState([
    {
      name: "Aming",
      position: "absolute",
      transformX: 0,
      transformY: 0,
      ui: "0%",
      flow: "0%",
      status: "Good",
      image:
        "https://cdn.discordapp.com/avatars/545817204420247593/76cea7372c05e4e793fd466599a6e43d.webp?size=128",
    },
    {
      name: "Rita",
      position: "absolute",
      transformX: 0,
      transformY: 0,
      ui: "0%",
      flow: "0%",
      status: "Good",
      image:
        "https://cdn.discordapp.com/avatars/926026373481504829/d906a648952f2d18b030dcad11d4d18a.webp?size=128",
    },
    {
      name: "雅筑",
      position: "absolute",
      transformX: 0,
      transformY: 0,
      ui: "0%",
      flow: "0%",
      status: "Good",
      image:
        "https://cdn.discordapp.com/avatars/926153880839024650/f346dbbe6d6d9171423ba74f66ab760b.webp?size=128",
    },
    {
      name: "清華",
      position: "absolute",
      transformX: 0,
      transformY: 0,
      ui: "0%",
      flow: "0%",
      status: "Good",
      image:
        "https://cdn.discordapp.com/avatars/926014757763432458/1ffa31e2005c1276963378a682573ef3.webp?size=128",
    },
    {
      name: "Vera",
      position: "absolute",
      transformX: 0,
      transformY: 0,
      ui: "0%",
      flow: "0%",
      status: "Good",
      image:
        "https://cdn.discordapp.com/avatars/915475360894840873/eeab64dbbbe567c39fa045129d11fa3d.webp?size=128",
    },
    {
      name: "Sky",
      position: "absolute",
      transformX: 0,
      transformY: 0,
      ui: "0%",
      flow: "0%",
      status: "Good",
      image:
        "https://cdn.discordapp.com/avatars/578937882325286923/1a7b00eb01cea3480bd2467e447513d5.webp?size=128",
    },
    {
      name: "Tristan",
      position: "absolute",
      transformX: 0,
      transformY: 0,
      ui: "0%",
      flow: "0%",
      status: "Good",
      image:
        "https://cdn.discordapp.com/avatars/742406299865579560/67a8323c337cb4de0ebef3296217e795.webp?size=128",
    },
    {
      name: "Shane",
      position: "absolute",
      transformX: 0,
      transformY: 0,
      ui: "0%",
      flow: "0%",
      status: "Good",
      image:
        "https://cdn.discordapp.com/avatars/926107772217622588/a724ca0ea0759190e2c311ca47ef0e44.webp?size=128",
    },
    {
      name: "Alvin",
      position: "absolute",
      transformX: 0,
      transformY: 0,
      ui: "0%",
      flow: "0%",
      status: "Good",
      image:
        "https://cdn.discordapp.com/avatars/665016078178582529/88767b93a8a9847ec737d198a6572d7d.webp?size=128",
    },
    {
      name: "Judy",
      position: "absolute",
      transformX: 0,
      transformY: 0,
      ui: "0%",
      flow: "0%",
      status: "Good",
      image:
        "https://cdn.discordapp.com/avatars/822525064557232169/4e4c9e453d368d153434ed4002dd9c3c.webp?size=128",
    },
    {
      name: "Connie",
      position: "absolute",
      transformX: 0,
      transformY: 0,
      ui: "0%",
      flow: "0%",
      status: "Good",
      image:
        "https://cdn.discordapp.com/avatars/926068134971052063/0a04ad85a3b3dd1e489efa48ea26ebfe.webp?size=128",
    },
    {
      name: "Yoder",
      position: "absolute",
      transformX: 0,
      transformY: 0,
      ui: "0%",
      flow: "0%",
      status: "Good",
      image:
        "https://cdn.discordapp.com/avatars/772472739947741194/8ce53de399f29694620d685c607530c8.webp?size=128",
    },
    {
      name: "Sean",
      position: "absolute",
      transformX: 0,
      transformY: 0,
      ui: "0%",
      flow: "0%",
      status: "Good",
      image:
        "https://cdn.discordapp.com/avatars/509711603751583746/2b68c65753e4b4e952ad5762fb74d914.webp?size=128",
    },
    {
      name: "Blue",
      position: "absolute",
      transformX: 0,
      transformY: 0,
      ui: "0%",
      flow: "0%",
      status: "Good",
      image:
        "https://cdn.discordapp.com/avatars/926050163552841748/2120442d7fbdef3a3f62a50ed982f90c.webp?size=128",
    },
  ]);

  React.useEffect(() => {
    stack();
  }, []);

  function stack() {
    console.log("stack");
    let shuffleAry = [...presenters];
    let len = shuffleAry.length;
    shuffleAry.map((presenter, idx) => {
      presenter.position = "absolute";
      presenter.transformX = idx * 1;
      presenter.transformY = idx * 1;
      console.log(presenter);
    });
    setPresenters(shuffleAry);
  }

  function separate() {
    console.log("separate");
    let len = presenters.length;
    for (let i = 0; i < len; i++) {
      setTimeout(() => {
        let index = len - i - 1;
        let oldPresenters = [...presenters];
        let oldPresenter = oldPresenters[index];
        oldPresenter.position = "absolute";
        oldPresenter.transformX = (i % 4) * 340;
        oldPresenter.transformY = (Math.floor(i / 4) + 1) * 265;
        setPresenters(oldPresenters);
      }, i * 300);
    }
  }

  function shuffle() {
    let shuffleAry = [...presenters];
    shuffleAry.map((presenter, idx) => {
      presenter.transformX = idx * 4;
      presenter.transformY = idx * 4;
    });
    setPresenters(shuffleAry);

    let timer = setInterval(() => {
      let shuffleAry = [...presenters];
      shuffleAry.map((presenter, idx) => {
        presenter.position = "absolute";
        presenter.transformX = Math.random() * 400;
        presenter.transformY = Math.random() * 300;
      });
      setPresenters(shuffleAry);
    }, 200);

    setTimeout(() => {
      clearInterval(timer);
      let shuffleAry = [...presenters];
      for (let i = shuffleAry.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffleAry[i], shuffleAry[j]] = [shuffleAry[j], shuffleAry[i]];
      }
      shuffleAry.map((presenter, idx) => {
        presenter.position = "absolute";
        presenter.transformX = (idx % 4) * 340;
        presenter.transformY = (Math.floor(idx / 4) + 1) * 265;
      });
      setPresenters(shuffleAry);
    }, 3000);
  }

  // *3001#12345#*

  return (
    <div>
      <div class="container-header">
        <h1>Back-End #15</h1>
        <div class="row">
          <div class="col-md-3">
            <button
              type="button"
              class="btn btn-block btn-info"
              onClick={stack}
            >
              Stack
            </button>
          </div>
          <div class="col-md-3">
            <button
              type="button"
              class="btn btn-block btn-info"
              onClick={separate}
            >
              Separate
            </button>
          </div>
          <div class="col-md-3">
            <button
              type="button"
              class="btn btn-block btn-info"
              onClick={shuffle}
            >
              Shuffle
            </button>
          </div>
        </div>
      </div>

      <div id="container" style={{ "min-height": "450px" }}>
        <div class="row" style={{ position: "relative" }}>
          {presenters.map((presenter, idx) => {
            return (
              <div
                class="col-md-3"
                key={presenter.name}
                style={{
                  position: presenter.position,
                  transform: `translateX(${presenter.transformX}px) translateY(${presenter.transformY}px)`,
                  transition: "all 1s ease-out",
                }}
              >
                <div className="card card-widget widget-user">
                  <div className="widget-user-header bg-info">
                    <h3 className="widget-user-username">
                      {presenter.name} {presenter.zIndex}
                    </h3>
                    <h5 className="widget-user-desc">Founder &amp; CEO</h5>
                  </div>
                  <div className="widget-user-image">
                    <img
                      className="img-circle elevation-2"
                      src={presenter.image}
                      alt="User Avatar"
                    />
                  </div>
                  <div className="card-footer">
                    <div className="row">
                      <div className="col-sm-4 border-right">
                        <div className="description-block">
                          <h5 className="description-header">
                            {presenter.status}
                          </h5>
                          <span className="description-text">STATUS</span>
                        </div>
                      </div>
                      <div className="col-sm-4 border-right">
                        <div className="description-block">
                          <h5 className="description-header">{presenter.ui}</h5>
                          <span className="description-text">UI</span>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="description-block">
                          <h5 className="description-header">
                            {presenter.flow}
                          </h5>
                          <span className="description-text">FLOW</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* <div class="row">
        <img src="static/Product presentation.gif" alt="" class="col-lg-5" />
        <ul class="col-lg-7 lists">
          {presenters.map((presneter, idx) => (
            <li key={`list-` + presneter.name}>
              {idx + 1}: {presneter.name}
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
