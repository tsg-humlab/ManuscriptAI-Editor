/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto';
import IndexView from "@/pages/index.vue";
import LandingView from "@/pages/LandingView.vue";
import StructureView from "@/pages/StructureView.vue";
import NextPage from "@/pages/NextPage.vue";
import MentionInformation from "@/pages/mention_information.vue";
import PhysicalCharacteristics from "@/pages/PhysicalCharacteristics.vue";
import Locus from "@/pages/Locus.vue";
import ManuscriptDescriptionChoice from "@/pages/ManuscriptDescriptionChoice.vue";
import Source from "@/pages/source.vue";
import DownloadView from "@/pages/download.vue";
import ConvertLODView from "@/pages/ConvertLODView.vue";
import annotate from '@/pages/annotate.vue';
import RdfPage from "@/pages/RdfPage.vue";
import AutoClassifyView from "@/pages/AutoClassifyView.vue";
import ResultsView from "@/pages/resultsView.vue";
import Login from "@/pages/Login.vue"
import Register from "@/pages/Register.vue";


//TODO: update all the routes..
const routes = [
  // { path: "/", name: "landing", component: LandingView, meta:{ title: 'Welcome to Manuscript AI suite!'} },
  // { path: "/stepper", name: "stepper", component: IndexView, meta:{title: 'Automated extraction'} },
  // { path: "/structure", name: "structure", component: StructureView },
  // { path: "/nextpage", name: "nextpage", component: NextPage },
  // { path: "/mention-information", name: "mentionInformation", component: MentionInformation },
  {
    path:"/",
    name: "landing",
    component: LandingView,
    meta:{ title: 'Welcome to Manuscript AI suite!', breadcrumb: "Main"},
  },
  {
    path: "/stepper",
    name: "stepper",
    component: IndexView,
    meta:{title: 'Automated extraction', breadcrumb: 'Automated extraction', breadcrumbTrail: [
        { text: 'Main', to: '/' },
        { text: 'Stepper', to: null }
      ]}
  },
  {
    path: "/structure",
    name: "structure",
    component: StructureView,
    meta: {
      title: 'Structure page',
      breadcrumb: 'Structure page',
      breadcrumbTrail: [
        { text: 'Main', to: '/' },
        { text: 'Structure page', to: null }
      ]
    }
  },
  { path: "/nextpage", name: "nextpage", component: NextPage,
    meta:{ title:'nextPage',breadcrumb: 'Next page',
      breadcrumbTrail: [
        { text: 'Main', to: '/' },
        // { text: 'Structure page', to: '/structure' },
        { text: 'Next page', to: null }

      ]}
  },
  { path: "/mention-information", name: "mentionInformation", component: MentionInformation,
    meta:{
    title:'Mention information page',
      breadcrumb: 'Mention information',
      breadcrumbTrail: [
        { text: 'Main', to: '/' },
        // { text: 'Structure page', to: '/structure' },
        // { text: 'Next page', to: '/nextpage' },
        { text: 'Mention information', to: null }
      ],
    }
  },
  {
    path: "/physical-characteristics", name: "physicalCharacteristics", component: PhysicalCharacteristics,
    meta:{
    title: 'Physical characteristics',
      breadcrumb: 'Physical characteristics',
      breadcrumbTrail: [
        { text: 'Main', to: '/' },
        { text: 'Physical characteristics', to: null }
      ]
    }
  },
  {
    path: "/locus", name: "locus", component: Locus,
    meta:{
    title: 'Locus',
      breadcrumb: 'Locus',
      breadcrumbTrail: [
        { text: 'Main', to: '/' },
        { text: 'Locus', to: null }
      ]
    }
  },
  {
    path: "/manuscript-description-choice", name: "manuscriptDescriptionChoice", component: ManuscriptDescriptionChoice,
    meta:{
    title: 'Manuscript Description Choice',
      breadcrumb: 'Manuscript Description Choice',
      breadcrumbTrail: [
        { text: 'Main', to: '/' },
        { text: 'Manuscript Description Choice', to: null }
      ]
    }
  },
  {
    path: "/source", name: "source", component: Source,
    meta:{
    title: 'Source',
      breadcrumb: 'Source',
      breadcrumbTrail: [
        { text: 'Main', to: '/' },
        { text: 'Source', to: null }
      ]
    }
  },
  {
    path: "/download", name: "download", component: DownloadView,
    meta:{
      title: 'Download',
      breadcrumb: 'Download',
      breadcrumbTrail: [
        { text: 'Main', to: '/' },
        { text: 'Download', to: null }
      ]
    }
  },
  { path: "/convert-lod", name: "convert-lod", component: ConvertLODView,
    meta: {
      title: 'Structure data using our ontology',
      breadcrumb: 'Create LOD',
      breadcrumbTrail: [
        { text: 'Main', to: "/" },
        { text: 'Download', to: null }
      ]
    }
  },
  { path: '/annotate', name: 'annotate', component: annotate, meta:{
    title: 'Annotation',
      breadcrumb: 'Annotate',
      breadcrumbTrail: [
        { text: 'Main', to: '/' },
        { text: 'Annotate', to: null }
      ]
    }
  },
  { path: "/rdf-page", name: "RdfPage", component: RdfPage,
    meta:{
    title: 'RdfPage',
      breadcrumb: 'RdfPage',
      breadcrumbTrail: [
        { text: 'Main', to: '/' },
        { text: 'RdfPage', to: null }
      ]
    }
  },
  { path: "/auto-classify", name: "autoClassify", component: AutoClassifyView,
    meta:{
    title: 'Fully automatic classification',
      breadcrumb: 'Locus',
      breadcrumbTrail: [
        { text: 'Main', to: '/' },
        { text: 'Automatic classification', to: null }
      ]
    }
  },
  {
    path: "/results", name: "results", component: ResultsView,meta:{
    title: 'Results',
      breadcrumb: 'Results',
      breadcrumbTrail: [
        { text: 'Main', to: '/' },
        { text: 'Results', to: null }
      ]
    }

  },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: 'Login page',
        breadcrumb: 'Login',
        breadcrumbTrail: [
          { text: 'Main', to: '/'},
          { text: 'Login', to: null}
        ]
      }

  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
        title: 'Registration page',
        breadcrumb: 'Register',
        breadcrumbTrail: [
          { text: 'Main', to: '/'},
          { text: 'Register', to: null}
        ]
      }
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

router.afterEach((to) => {
  document.title = to.meta.title || "Welcome to Manuscript AI!";
});


export default router
