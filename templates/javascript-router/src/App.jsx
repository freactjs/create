import { useMemo } from "@freact/core";
import { Link, NavLink, Navigate, Outlet, Route, Routes, useNavigate, useParams } from "@freact/router";

const EXAMPLE_DATA = [
  {
    id: 0,
    title: 'Causa autem fuit huc veniendi',
    image: 'https://picsum.photos/seed/frtemp0/450',
    author: 'Anita Oneill',
    text: 'Vitiosum est enim in dividendo partem in genere numerare. Igitur neque stultorum quisquam beatus neque sapientium non beatus. Illud dico, ea, quae dicat, praeclare inter se cohaerere. Non minor, inquit, voluptas percipitur ex vilissimis rebus quam ex pretiosissimis. Quod quidem iam fit etiam in Academia. Quam ob rem tandem, inquit, non satisfacit? Dolor ergo, id est summum malum, metuetur semper, etiamsi non aderit; Sin aliud quid voles, postea.',
  },
  {
    id: 1,
    title: 'Itaque sensibus rationem',
    image: 'https://picsum.photos/seed/frtemp1/450',
    author: 'Hugo Lopez',
    text: 'Tenent mordicus. Sin kakan malitiam dixisses, ad aliud nos unum certum vitium consuetudo Latina traduceret. In quibus doctissimi illi veteres inesse quiddam caeleste et divinum putaverunt. Apud ceteros autem philosophos, qui quaesivit aliquid, tacet; Cum autem in quo sapienter dicimus, id a primo rectissime dicitur. Stoicos roga. Nulla profecto est, quin suam vim retineat a primo ad extremum. Sed potestne rerum maior esse dissensio?',
  },
  {
    id: 2,
    title: 'Portenta haec esse dicit, neque ea ratione',
    image: 'https://picsum.photos/seed/frtemp6/450',
    author: 'Luke Arnold',
    text: 'O magnam vim ingenii causamque iustam, cur nova existeret disciplina! Perge porro. Facit enim ille duo seiuncta ultima bonorum, quae ut essent vera, coniungi debuerunt; Qui autem diffidet perpetuitati bonorum suorum, timeat necesse est, ne aliquando amissis illis sit miser. Quia, si mala sunt, is, qui erit in iis, beatus non erit. Ipse Epicurus fortasse redderet, ut Sextus Peducaeus, Sex. Experiamur igitur, inquit, etsi habet haec Stoicorum ratio difficilius quiddam et obscurius. Magni enim aestimabat pecuniam non modo non contra leges, sed etiam legibus partam.',
  },
  {
    id: 3,
    title: 'Eodem modo is enim tibi nemo dabit',
    image: 'https://picsum.photos/seed/frtemp3/450',
    author: 'Felix Fischer',
    text: 'Bork Quae hic rei publicae vulnera inponebat, eadem ille sanabat. Hoc loco discipulos quaerere videtur, ut, qui asoti esse velint, philosophi ante fiant. Ergo id est convenienter naturae vivere, a natura discedere. Collatio igitur ista te nihil iuvat. Idem etiam dolorem saepe perpetiuntur, ne, si id non faciant, incidant in maiorem. Qui autem voluptate vitam effici beatam putabit, qui sibi is conveniet, si negabit voluptatem crescere longinquitate?',
  },
  {
    id: 4,
    title: 'Triarium aliquid de dissensione nostra iudicare',
    image: 'https://picsum.photos/seed/frtemp4/450',
    author: 'Candice Gregory',
    text: 'Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Dempta enim aeternitate nihilo beatior Iuppiter quam Epicurus; Tollitur beneficium, tollitur gratia, quae sunt vincla concordiae. An me, inquam, nisi te audire vellem, censes haec dicturum fuisse? Inscite autem medicinae et gubernationis ultimum cum ultimo sapientiae comparatur. Nihil illinc huc pervenit. Nam memini etiam quae nolo, oblivisci non possum quae volo. Ait enim se, si uratur, Quam hoc suave! dicturum. Nec vero alia sunt quaerenda contra Carneadeam illam sententiam. Primum Theophrasti, Strato, physicum se voluit.',
  }
];

const Layout = () => {
  return (
    <>
      <nav>
        <NavLink className='nav-link' to='/'>Home</NavLink>
        <NavLink className='nav-link' to='/articles'>Articles</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
};

const Home = () => {
  return (
    <>
      <h1>Home</h1>
      <p>Welcome to this very cool news website I created for the Freact router templates. In this template, you'll be able to see how nested routes, outlets, links and navlinks work. The API is almost identical to react-router-dom so just use that as a reference in case you get confused. Click <Link to="/articles">here</Link> to see the articles.</p>
    </>
  );
};

const ArticleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const article = useMemo(() => {
    return EXAMPLE_DATA.find(x => x.id === +id);
  }, [id]);

  if (article === undefined) {
    navigate('/', { replace: true })
    return <></>;
  }

  return (
    <div
      className='art-view-wrap'
      onClick={() => navigate(-1)}
    >
      <div
        className='art-view'
        onClick={e => e.stopPropagation()}
      >
        <div
          className='thumb'
          style={{ backgroundImage: `url(${article.image})` }}
        >
          <div
            className='close'
            onClick={() => navigate(-1)}
          >X</div>
        </div>
        <article>
          <div className='title'>{article.title}</div>
          <div className='author'>{article.author}</div>
          <div className='div-wrap'>
            <div className='div'></div>
          </div>
          <div className='text'>{article.text}</div>
        </article>
      </div>
    </div>
  );
};

const Articles = () => {
  return (
    <>
      <h1>Articles</h1>
      {EXAMPLE_DATA.map(x => (
        <div className='art-card-wrap' key={x.id}>
          <Link to={`${x.id}`}>
            <div className='art-card'>
              <div
                className='thumb'
                style={{ backgroundImage: `url(${x.image})` }}
              ></div>
              <div className='info'>
                <div className='title'>{x.title}</div>
                <div className='author'>{x.author}</div>
              </div>
            </div>
          </Link>
        </div>
      ))}
      <Outlet />
    </>
  );
};

export const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/' element={<Home />} />
        <Route path='articles' element={<Articles />}>
          <Route path=':id' element={<ArticleView />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to='/' />} />
    </Routes>
  );
};
