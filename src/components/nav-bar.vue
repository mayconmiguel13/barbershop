<script>
import { layoutMethods } from "@/state/helpers";
import img1 from "../assets/images/products/img-1.png"
import img2 from "../assets/images/products/img-2.png"
import img3 from "../assets/images/products/img-3.png"
import img4 from "../assets/images/products/img-6.png"
import img5 from "../assets/images/products/img-5.png"

import simplebar from "simplebar-vue";

import i18n from "../i18n";

/**
 * Nav-bar Component
 */
export default {
  data() {
    return {
      cartItems: [
        {
          id: 1,
          productImage: img1,
          productName: "Branded T-Shirts",
          productLink: "/ecommerce/product-details",
          quantity: "10 x $32",
          itemPrice: "320",
        },
        {
          id: 2,
          productImage: img2,
          productName: "Bentwood Chair",
          productLink: "/ecommerce/product-details",
          quantity: "5 x $18",
          itemPrice: "89",
        },
        {
          id: 3,
          productImage: img3,
          productName: "Borosil Paper Cup",
          productLink: "/ecommerce/product-details",
          quantity: "3 x $250",
          itemPrice: "750",
        },
        {
          id: 4,
          productImage: img4,
          productName: "Gray Styled T-Shirt",
          productLink: "/ecommerce/product-details",
          quantity: "1 x $1250",
          itemPrice: "1250",
        },
        {
          id: 5,
          productImage: img5,
          productName: "Stillbird Helmet",
          productLink: "/ecommerce/product-details",
          quantity: "2 x $495",
          itemPrice: "990",
        },
      ],

      languages: [{
        flag: require("@/assets/images/flags/us.svg"),
        language: "en",
        title: "English",
      },
      {
        flag: require("@/assets/images/flags/spain.svg"),
        language: "sp",
        title: "Española",
      },
      {
        flag: require("@/assets/images/flags/germany.svg"),
        language: "gr",
        title: "Deutsche",
      },
      {
        flag: require("@/assets/images/flags/italy.svg"),
        language: "it",
        title: "italiana",
      },
      {
        flag: require("@/assets/images/flags/russia.svg"),
        language: "ru",
        title: "русский",
      },
      {
        flag: require("@/assets/images/flags/china.svg"),
        language: "ch",
        title: "中國人",
      },
      {
        flag: require("@/assets/images/flags/french.svg"),
        language: "fr",
        title: "Français",
      },
      {
        flag: require("@/assets/images/flags/ae.svg"),
        language: "ar",
        title: "Arabic",
      },
      ],
      lan: i18n.locale,
      text: null,
      flag: null,
      value: null,
      myVar: 1,
    };
  },
  components: {
    simplebar
  },

  methods: {
    ...layoutMethods,
    isCustomDropdown() {
      //Search bar
      var searchOptions = document.getElementById("search-close-options");
      var dropdown = document.getElementById("search-dropdown");
      var searchInput = document.getElementById("search-options");

      searchInput.addEventListener("focus", () => {
        var inputLength = searchInput.value.length;
        if (inputLength > 0) {
          dropdown.classList.add("show");
          searchOptions.classList.remove("d-none");
        } else {
          dropdown.classList.remove("show");
          searchOptions.classList.add("d-none");
        }
      });

      searchInput.addEventListener("keyup", () => {
        var inputLength = searchInput.value.length;
        if (inputLength > 0) {
          dropdown.classList.add("show");
          searchOptions.classList.remove("d-none");
        } else {
          dropdown.classList.remove("show");
          searchOptions.classList.add("d-none");
        }
      });

      searchOptions.addEventListener("click", () => {
        searchInput.value = "";
        dropdown.classList.remove("show");
        searchOptions.classList.add("d-none");
      });

      document.body.addEventListener("click", (e) => {
        if (e.target.getAttribute("id") !== "search-options") {
          dropdown.classList.remove("show");
          searchOptions.classList.add("d-none");
        }
      });
    },
    toggleHamburgerMenu() {
      var windowSize = document.documentElement.clientWidth;
      let layoutType = document.documentElement.getAttribute("data-layout");

      document.documentElement.setAttribute("data-sidebar-visibility", "show");
      let visiblilityType = document.documentElement.getAttribute("data-sidebar-visibility");

      if (windowSize > 767)
        document.querySelector(".hamburger-icon").classList.toggle("open");

      //For collapse horizontal menu
      if (
        document.documentElement.getAttribute("data-layout") === "horizontal"
      ) {
        document.body.classList.contains("menu") ?
          document.body.classList.remove("menu") :
          document.body.classList.add("menu");
      }

      //For collapse vertical menu

      if (visiblilityType === "show" && (layoutType === "vertical" || layoutType === "semibox")) {
        if (windowSize < 1025 && windowSize > 767) {
          document.body.classList.remove("vertical-sidebar-enable");
          document.documentElement.getAttribute("data-sidebar-size") == "sm" ?
            document.documentElement.setAttribute("data-sidebar-size", "") :
            document.documentElement.setAttribute("data-sidebar-size", "sm");
        } else if (windowSize > 1025) {
          document.body.classList.remove("vertical-sidebar-enable");
          document.documentElement.getAttribute("data-sidebar-size") == "lg" ?
            document.documentElement.setAttribute("data-sidebar-size", "sm") :
            document.documentElement.setAttribute("data-sidebar-size", "lg");
        } else if (windowSize <= 767) {
          document.body.classList.add("vertical-sidebar-enable");
          document.documentElement.setAttribute("data-sidebar-size", "lg");
        }
      }

      //Two column menu
      if (document.documentElement.getAttribute("data-layout") == "twocolumn") {
        document.body.classList.contains("twocolumn-panel") ?
          document.body.classList.remove("twocolumn-panel") :
          document.body.classList.add("twocolumn-panel");
      }
    },
    toggleMenu() {
      this.$parent.toggleMenu();
    },
    toggleRightSidebar() {
      this.$parent.toggleRightSidebar();
    },
    initFullScreen() {
      document.body.classList.toggle("fullscreen-enable");
      if (
        !document.fullscreenElement &&
        /* alternative standard method */
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(
            Element.ALLOW_KEYBOARD_INPUT
          );
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },
    setLanguage(locale, country, flag) {
      this.lan = locale;
      this.text = country;
      this.flag = flag;
      document.getElementById("header-lang-img").setAttribute("src", flag);
      i18n.global.locale = locale;
    },
    toggleDarkMode() {

      if (document.documentElement.getAttribute("data-bs-theme") == "dark") {
        document.documentElement.setAttribute("data-bs-theme", "light");
      } else {
        document.documentElement.setAttribute("data-bs-theme", "dark");
      }

      const mode = document.documentElement.getAttribute("data-bs-theme")
      this.changeMode({
        mode: mode,
      });
    },
    removeItem(cartItem) {
      this.cartItems = this.cartItems.filter(item => item.id !== cartItem.id)
      this.$emit("cart-item-price", this.cartItems.length);
    },
  },

  computed: {
    calculateTotalPrice() {
      return this.cartItems.reduce((total, item) => total + parseFloat(item.itemPrice), 0).toFixed(2);
    },
  },
  mounted() {
    if (process.env.VUE_APP_I18N_LOCALE) {
      this.flag = process.env.VUE_APP_I18N_LOCALE;
      this.languages.forEach((item) => {
        if (item.language == this.flag) {
          document.getElementById("header-lang-img").setAttribute("src", item.flag);
        }
      });
    }

    document.addEventListener("scroll", function () {
      var pageTopbar = document.getElementById("page-topbar");
      if (pageTopbar) {
        document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50 ? pageTopbar.classList.add(
          "topbar-shadow") : pageTopbar.classList.remove("topbar-shadow");
      }
    });
    if (document.getElementById("topnav-hamburger-icon"))
      document
        .getElementById("topnav-hamburger-icon")
        .addEventListener("click", this.toggleHamburgerMenu);

    this.isCustomDropdown();
  },
};
</script>

<template>
  <header id="page-topbar">
    <div class="layout-width">
      <div class="navbar-header">
        <div class="d-flex">
          <!-- LOGO -->
          <div class="navbar-brand-box horizontal-logo">
            <router-link to="/" class="logo logo-dark">
              <span class="logo-sm">
                <img src="@/assets/images/logo-sm.png" alt="" height="22" />
              </span>
              <span class="logo-lg">
                <img src="@/assets/images/logo-dark.png" alt="" height="17" />
              </span>
            </router-link>

            <router-link to="/" class="logo logo-light">
              <span class="logo-sm">
                <img src="@/assets/images/logo-sm.png" alt="" height="22" />
              </span>
              <span class="logo-lg">
                <img src="@/assets/images/logo-light.png" alt="" height="17" />
              </span>
            </router-link>
          </div>

          <BButton variant="white" type="button"
            class="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger  material-shadow-none" id="topnav-hamburger-icon">
            <span class="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </BButton>

          <!-- App Search-->
          <form class="app-search d-none d-md-block">
            <div class="position-relative">
              <input type="text" class="form-control" placeholder="Search..." autocomplete="off" id="search-options"
                value="" />
              <span class="mdi mdi-magnify search-widget-icon"></span>
              <span class="mdi mdi-close-circle search-widget-icon search-widget-icon-close d-none"
                id="search-close-options"></span>
            </div>
            <div class="dropdown-menu dropdown-menu-lg" id="search-dropdown">
              <simplebar data-simplebar style="max-height: 320px">
                <div class="dropdown-header">
                  <h6 class="text-overflow text-muted mb-0 text-uppercase">
                    Recent Searches
                  </h6>
                </div>

                <div class="dropdown-item bg-transparent text-wrap">
                  <router-link to="/" class="btn btn-soft-secondary btn-sm rounded-pill">how to setup <i
                      class="mdi mdi-magnify ms-1"></i></router-link>
                  <router-link to="/" class="btn btn-soft-secondary btn-sm rounded-pill">buttons <i
                      class="mdi mdi-magnify ms-1"></i></router-link>
                </div>
                <div class="dropdown-header mt-2">
                  <h6 class="text-overflow text-muted mb-1 text-uppercase">
                    Pages
                  </h6>
                </div>

                <BLink href="javascript:void(0);" class="dropdown-item notify-item">
                  <i class=" ri-bubble-chart-line align-middle fs-18 text-muted me-2"></i>
                  <span>Analytics Dashboard</span>
                </BLink>

                <BLink href="javascript:void(0);" class="dropdown-item notify-item">
                  <i class="ri-lifebuoy-line align-middle fs-18 text-muted me-2"></i>
                  <span>Help Center</span>
                </BLink>

                <BLink href="javascript:void(0);" class="dropdown-item notify-item">
                  <i class=" ri-user-settings-line align-middle fs-18 text-muted me-2"></i>
                  <span>My account settings</span>
                </BLink>

                <div class="dropdown-header mt-2">
                  <h6 class="text-overflow text-muted mb-2 text-uppercase">
                    Members
                  </h6>
                </div>

                <div class="notification-list">
                  <BLink href="javascript:void(0);" class="d-flex dropdown-item notify-item py-2">
                    <img src="@/assets/images/users/avatar-2.jpg" class="me-3 rounded-circle avatar-xs" alt="user-pic" />
                    <div class="flex-grow-1">
                      <h6 class="m-0">Angela Bernier</h6>
                      <span class="fs-11 mb-0 text-muted">Manager</span>
                    </div>
                  </BLink>
                  <BLink href="javascript:void(0);" class="d-flex dropdown-item notify-item py-2">
                    <img src="@/assets/images/users/avatar-3.jpg" class="me-3 rounded-circle avatar-xs" alt="user-pic" />
                    <div class="flex-grow-1">
                      <h6 class="m-0">David Grasso</h6>
                      <span class="fs-11 mb-0 text-muted">Web Designer</span>
                    </div>
                  </BLink>
                  <BLink href="javascript:void(0);" class="d-flex dropdown-item notify-item py-2">
                    <img src="@/assets/images/users/avatar-5.jpg" class="me-3 rounded-circle avatar-xs" alt="user-pic" />
                    <div class="flex-grow-1">
                      <h6 class="m-0">Mike Bunch</h6>
                      <span class="fs-11 mb-0 text-muted">React Developer</span>
                    </div>
                  </BLink>
                </div>
              </simplebar>

              <div class="text-center pt-3 pb-1">
                <router-link to="/pages/search-results" class="btn btn-primary btn-sm">View All Results <i
                    class="ri-arrow-right-line ms-1"></i></router-link>
              </div>
            </div>
          </form>
        </div>

        <div class="d-flex align-items-center">
          <BDropdown class="dropdown d-md-none topbar-head-dropdown header-item" variant="ghost-secondary" dropstart
            no-caret :offset="{ alignmentAxis: 55, crossAxis: 15, mainAxis: 0 }"
            toggle-class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle material-shadow-none show "
            menu-class="dropdown-menu-lg dropdown-menu-end p-0">
            <template #button-content>
              <i class="bx bx-search fs-22"></i>
            </template>
            <BDropdownItem aria-labelledby="page-header-search-dropdown">
              <form class="p-3">
                <div class="form-group m-0">
                  <div class="input-group">
                    <input type="text" class="form-control" placeholder="Search ..." aria-label="Recipient's username" />
                    <BButton variant="primary" type="submit">
                      <i class="mdi mdi-magnify"></i>
                    </BButton>
                  </div>
                </div>
              </form>
            </BDropdownItem>
          </BDropdown>

          <BDropdown class="dropdown" variant="ghost-secondary" dropstart no-caret
            :offset="{ alignmentAxis: 55, crossAxis: 15, mainAxis: -50 }"
            toggle-class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle material-shadow-none" menu-class="dropdown-menu-end">
            <template #button-content> <img id="header-lang-img" src="@/assets/images/flags/us.svg" alt="Header Language"
                height="20" class="rounded">
            </template>
            <BLink href="javascript:void(0);" class="dropdown-item notify-item language py-2"
              v-for="(entry, key) in languages" :data-lang="entry.language" :title="entry.title"
              @click="setLanguage(entry.language, entry.title, entry.flag)" :key="key">
              <img :src="entry.flag" alt="user-image" class="me-2 rounded" height="18">
              <span class="align-middle">{{ entry.title }}</span>
            </BLink>
          </BDropdown>

          <BDropdown class="dropdown" variant="ghost-secondary" dropstart no-caret
            :offset="{ alignmentAxis: 57, crossAxis: 0, mainAxis: -42 }"
            toggle-class="btn-icon btn-topbar rounded-circle mode-layout ms-1 material-shadow-none" menu-class="p-0 dropdown-menu-end">
            <template #button-content>
              <i class="bx bx-category-alt fs-22"></i>
            </template>
            <div class="p-3 border-top-0 dropdown-head border-start-0 border-end-0 border-dashed border dropdown-menu-lg">
              <BRow class="align-items-center">
                <BCol>
                  <h6 class="m-0 fw-semibold fs-15">Web Apps</h6>
                </BCol>
                <BCol cols="auto">
                  <BLink href="#!" class="btn btn-sm btn-soft-info">
                    View All Apps
                    <i class="ri-arrow-right-s-line align-middle"></i>
                  </BLink>
                </BCol>
              </BRow>
            </div>

            <div class="p-2">
              <BRow class="g-0">
                <BCol>
                  <BLink class="dropdown-icon-item" href="#!">
                    <img src="@/assets/images/brands/github.png" alt="Github" />
                    <span>GitHub</span>
                  </BLink>
                </BCol>
                <BCol>
                  <BLink class="dropdown-icon-item" href="#!">
                    <img src="@/assets/images/brands/bitbucket.png" alt="bitbucket" />
                    <span>Bitbucket</span>
                  </BLink>
                </BCol>
                <BCol>
                  <BLink class="dropdown-icon-item" href="#!">
                    <img src="@/assets/images/brands/dribbble.png" alt="dribbble" />
                    <span>Dribbble</span>
                  </BLink>
                </BCol>
              </BRow>

              <BRow class="g-0">
                <BCol>
                  <BLink class="dropdown-icon-item" href="#!">
                    <img src="@/assets/images/brands/dropbox.png" alt="dropbox" />
                    <span>Dropbox</span>
                  </BLink>
                </BCol>
                <BCol>
                  <BLink class="dropdown-icon-item" href="#!">
                    <img src="@/assets/images/brands/mail_chimp.png" alt="mail_chimp" />
                    <span>Mail Chimp</span>
                  </BLink>
                </BCol>
                <BCol>
                  <BLink class="dropdown-icon-item" href="#!">
                    <img src="@/assets/images/brands/slack.png" alt="slack" />
                    <span>Slack</span>
                  </BLink>
                </BCol>
              </BRow>
            </div>
          </BDropdown>

          <BDropdown variant="ghost-secondary" dropstart :offset="{ alignmentAxis: 57, crossAxis: 0, mainAxis: -42 }"
            no-caret class="ms-1 dropdown" toggle-class="btn-icon btn-topbar rounded-circle mode-layout material-shadow-none"
            menu-class="dropdown-menu-xl dropdown-menu-end p-0" text="Manual close (auto-close=false)"
            auto-close="outside">
            <template #button-content>
              <i class="bx bx-shopping-bag fs-22"></i>
              <span
                class="position-absolute topbar-badge cartitem-badge fs-10 translate-middle badge rounded-pill bg-info">{{
                  cartItems.length }} </span>
            </template>

            <div class="p-3 border-top-0 border-start-0 dropdown-head border-end-0 border-dashed border dropdown-menu-xl">
              <BRow class="align-items-center">
                <BCol>
                  <h6 class="m-0 fs-16 fw-semibold"> My Cart</h6>
                </BCol>
                <BCol cols="auto">
                  <BBadge variant="warning-subtle" class="bg-warning-subtle text-warning fs-13"><span
                      class="cartitem-badge"> {{ cartItems.length }} </span>
                    items</BBadge>
                </BCol>
              </BRow>
            </div>
            <simplebar data-simplebar style="max-height: 300px">
              <div class="p-2">
                <div class="text-center empty-cart" id="empty-cart" v-if="cartItems.length === 0">
                  <div class="avatar-md mx-auto my-3">
                    <div class="avatar-title bg-info-subtle text-info fs-36 rounded-circle">
                      <i class="bx bx-cart"></i>
                    </div>
                  </div>
                  <h5 class="mb-3">Your Cart is Empty!</h5>
                  <router-link to="/ecommerce/products" class="btn btn-success w-md mb-3">Shop Now</router-link>
                </div>
                <div class="d-block dropdown-item dropdown-item-cart text-wrap px-3 py-2"
                  v-for="(item, index) in cartItems" :key="index">
                  <div class="d-flex align-items-center">
                    <img :src="item.productImage" class="me-3 rounded-circle avatar-sm p-2 bg-light" />
                    <div class="flex-grow-1">
                      <h6 class="mt-0 mb-1 fs-14">
                        <router-link :to="item.productLink" class="text-reset">{{ item.productName }}</router-link>
                      </h6>
                      <p class="mb-0 fs-12 text-muted">
                        Quantity: <span>{{ item.quantity }}</span>
                      </p>
                    </div>
                    <div class="px-2">
                      <h5 class="m-0 fw-normal">$<span class="cart-item-price">{{ item.itemPrice }}</span></h5>
                    </div>
                    <div class="ps-2">
                      <BButton variant="ghost-secondary" size="sm" class="btn-icon remove-item-btn"
                        @click="removeItem(item)">
                        <i class="ri-close-fill fs-16"></i>
                      </BButton>
                    </div>
                  </div>
                </div>
              </div>
            </simplebar>
            <div v-if="cartItems.length" class="p-3 border-bottom-0 border-start-0 border-end-0 border-dashed border"
              id="checkout-elem">
              <div class="d-flex justify-content-between align-items-center pb-3">
                <h5 class="m-0 text-muted">Total:</h5>
                <div class="px-2">
                  <h5 class="m-0" id="cart-item-total">${{ calculateTotalPrice }}</h5>
                </div>
              </div>

              <router-link to="/ecommerce/checkout" class="btn btn-success text-center w-100">
                Checkout
              </router-link>
            </div>
          </BDropdown>

          <div class="ms-1 header-item d-none d-sm-flex">
            <BButton type="button" variant="ghost-secondary" class="btn-icon btn-topbar rounded-circle material-shadow-none"
              data-toggle="fullscreen" @click="initFullScreen">
              <i class="bx bx-fullscreen fs-22"></i>
            </BButton>
          </div>

          <div class="ms-1 header-item d-none d-sm-flex">
            <BButton type="button" variant="ghost-secondary" class="btn-icon btn-topbar rounded-circle light-dark-mode material-shadow-none"
              @click="toggleDarkMode">
              <i class="bx bx-moon fs-22"></i>
            </BButton>
          </div>

          <BDropdown variant="ghost-dark" dropstart class="ms-1 dropdown" no-caret
            :offset="{ alignmentAxis: 57, crossAxis: 0, mainAxis: -42 }" toggle-class="btn-icon btn-topbar rounded-circle material-shadow-none"
            id="page-header-notifications-dropdown" menu-class="dropdown-menu-lg dropdown-menu-end p-0"
            auto-close="outside">
            <template #button-content>
              <i class='bx bx-bell fs-22'></i>
              <span class="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">
                <span class="notification-badge">3</span>
                <span class="visually-hidden">mensagens não lidas</span>
              </span>
            </template>
            <div class="dropdown-head bg-primary bg-pattern rounded-top dropdown-menu-lg">
              <div class="p-3">
                <BRow class="align-items-center">
                  <BCol>
                    <h6 class="m-0 fs-16 fw-semibold text-white">
                      Avisos da Rotina Escolar
                    </h6>
                  </BCol>
                  <BCol cols="auto" class="dropdown-tabs">
                    <BBadge variant="light" class="bg-light text-primary fs-12 fw-semibold">3 Pendentes</BBadge>
                  </BCol>
                </BRow>
              </div>
            </div>
            <BTabs nav-class="dropdown-tabs nav-tab-custom bg-primary px-2 pt-2">
              <BTab title=" Rotina & Alertas (3) " class="tab-pane fade py-2 ps-2 show" id="all-noti-tab" role="tabpanel">
                <simplebar data-simplebar style="max-height: 320px" class="pe-2">
                  <!-- Alerta 1: Portaria 17h -->
                  <div class="text-reset notification-item d-block dropdown-item position-relative border-bottom pb-2">
                    <div class="d-flex">
                      <div class="avatar-xs me-3 flex-shrink-0">
                        <span class="avatar-title bg-danger-subtle text-danger rounded-circle fs-16">
                          <i class="ri-shield-user-line"></i>
                        </span>
                      </div>
                      <div class="flex-grow-1">
                        <router-link to="/escola/alunos" class="stretched-link text-decoration-none">
                          <h6 class="mt-0 mb-1 fs-13 fw-semibold text-dark">
                            Portaria das 17:00h • Saída Segura
                          </h6>
                        </router-link>
                        <p class="mb-1 fs-12 text-muted">
                          Conferir documento dos autorizados antes da liberação dos alunos nos portões.
                        </p>
                        <p class="mb-0 fs-11 fw-medium text-danger">
                          <span><i class="mdi mdi-clock-outline"></i> Horário Integral (17:00h)</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Alerta 2: Reposição de Mochila -->
                  <div class="text-reset notification-item d-block dropdown-item position-relative border-bottom py-2">
                    <div class="d-flex">
                      <div class="avatar-xs me-3 flex-shrink-0">
                        <span class="avatar-title bg-warning-subtle text-warning rounded-circle fs-16">
                          <i class="ri-shopping-bag-line"></i>
                        </span>
                      </div>
                      <div class="flex-grow-1">
                        <router-link to="/escola/diario" class="stretched-link text-decoration-none">
                          <h6 class="mt-0 mb-1 fs-13 fw-semibold text-dark">
                            Reposição de Itens da Mochila
                          </h6>
                        </router-link>
                        <p class="mb-1 fs-12 text-muted">
                          Fraldas e pomada solicitadas hoje pela Tia Fernanda no Maternal I.
                        </p>
                        <p class="mb-0 fs-11 fw-medium text-warning">
                          <span><i class="mdi mdi-alert-circle-outline"></i> Notificar família no WhatsApp</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Alerta 3: Inclusão e Acolhimento TEA -->
                  <div class="text-reset notification-item d-block dropdown-item position-relative py-2">
                    <div class="d-flex">
                      <div class="avatar-xs me-3 flex-shrink-0">
                        <span class="avatar-title rounded-circle fs-16" style="background-color: #f3e8ff; color: #7e22ce;">
                          <i class="ri-puzzle-line"></i>
                        </span>
                      </div>
                      <div class="flex-grow-1">
                        <router-link to="/escola/alunos" class="stretched-link text-decoration-none">
                          <h6 class="mt-0 mb-1 fs-13 fw-semibold text-dark">
                            Acompanhamento de Inclusão (TEA)
                          </h6>
                        </router-link>
                        <p class="mb-1 fs-12 text-muted">
                          Helena Costa Ribeiro com plano sensorial ativo e apoio da monitora SEDUC.
                        </p>
                        <p class="mb-0 fs-11 fw-medium" style="color: #7e22ce;">
                          <span><i class="ri-heart-line"></i> Maternal II • Tia Juliana</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="my-2 text-center">
                    <router-link to="/escola/diario" class="btn btn-sm btn-soft-primary">
                      Abrir Diário Completo
                      <i class="ri-arrow-right-line align-middle ms-1"></i>
                    </router-link>
                  </div>
                </simplebar>
              </BTab>

              <BTab title="SEDUC / Convênio" class="p-3">
                <simplebar data-simplebar style="max-height: 280px" class="pe-2">
                  <div class="alert alert-info border-0 fs-12 mb-2">
                    <div class="fw-bold mb-1"><i class="ri-government-line me-1"></i> Prefeitura de Contagem</div>
                    Frequência diária obrigatória para o fechamento da folha mensal de repasse público.
                  </div>
                  <div class="text-center pt-2">
                    <router-link to="/" class="btn btn-sm btn-outline-primary">
                      Ver Frequência no Painel
                    </router-link>
                  </div>
                </simplebar>
              </BTab>
            </BTabs>
          </BDropdown>

          <BDropdown  variant="link" class="ms-sm-3 header-item topbar-user" toggle-class="rounded-circle material-shadow-none" no-caret
            id="page-header-user-dropdown" menu-class="dropdown-menu-end"
            :offset="{ alignmentAxis: -14, crossAxis: 0, mainAxis: 0 }">
            <template #button-content>
              <span class="d-flex align-items-center">
                <div class="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center fw-bold" style="width: 36px; height: 36px; font-size: 14px;">BF</div>
                <span class="text-start ms-xl-2">
                  <span class="d-none d-xl-inline-block ms-1 fw-medium user-name-text">Gerente Geral</span>
                  <span class="d-none d-xl-block ms-1 fs-12 user-name-sub-text">BarberFlow Pro</span>
                </span>
              </span>
            </template>
            <h6 class="dropdown-header">Gerência & Recepção</h6>
            <router-link class="dropdown-item" to="/pages/profile"><i
                class="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle"> Profile</span>
            </router-link>
            <router-link class="dropdown-item" to="/chat">
              <i class=" mdi mdi-message-text-outline text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle"> Messages</span>
            </router-link>
            <router-link class="dropdown-item" to="/apps/tasks-kanban">
              <i class="mdi mdi-calendar-check-outline text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle"> Taskboard</span>
            </router-link>
            <router-link class="dropdown-item" to="/pages/faqs"><i
                class="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle"> Help</span>
            </router-link>
            <div class="dropdown-divider"></div>
            <router-link class="dropdown-item" to="/pages/profile"><i
                class="mdi mdi-wallet text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle"> Balance : <b>$5971.67</b></span>
            </router-link>
            <router-link class="dropdown-item" to="/pages/profile-setting">
              <BBadge variant="success-subtle" class="bg-success-subtle text-success mt-1 float-end">New</BBadge><i
                class="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle"> Settings</span>
            </router-link>
            <router-link class="dropdown-item" to="/auth/lockscreen-basic"><i
                class="mdi mdi-lock text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle"> Lock screen</span>
            </router-link>
            <router-link class="dropdown-item" to="/logout"><i
                class="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
              <span class="align-middle" data-key="t-logout"> Logout</span>
            </router-link>
          </BDropdown>
        </div>
      </div>
    </div>
  </header>
</template>