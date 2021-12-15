Vue.component("cv-login",{
    template : 
    `    <div>
          <b-card bg-variant="light">
            <b-card-body>
              <b-form-group label-size="sm" label="Username:" label-for="login-user">
                <b-form-input id="login-user" v-model="userName" size="sm"></b-form-input>
              </b-form-group>
              <b-form-group label-size="sm" label="Password:" label-for="login-pwd">
                <b-form-input id="login-pwd" v-model="passWord" size="sm" type="password"></b-form-input>
              </b-form-group>
              <b-form-group label-size="sm" label="Country:" label-for="login-ctry" >
                <b-form-select size="sm" v-model="selCountry" :options="countries" value-field="key" text-field="name"></b-form-select>
              </b-form-group>
              <b-form-group label-size="sm" label="Workplace:" label-for="login-wkp" >
                <b-form-select size="sm" v-model="selWP" :options="workplaces" value-field="id" text-field="label"></b-form-select>
              </b-form-group>
              <br>
              <b-overlay :show="loading" rounded="sm">
                <b-button size="sm" variant="dark" block @click="requestLogin">Login</b-button>
              </b-overlay>
              <br><small class="text-center text-danger">{{loginError}}</small>
            </b-card-body>
          </b-card>
         </div> `
    ,
    props : {
    },
    data : function() {
      return {
          loginError : "",
          countries : [],
          workplaces : [],
          selCountry : -1,
          selWP : -1,
          userName : "",
          passWord : "",
          loading : false
      };
    },
    created: function() {
        // before rendering
        axios.get('https://mobile.covisian.com/routing/bridge/bridge-to-services-154/spartaaiws/api/sparta2/country-corporate')
        .then(response => {
          response.data.countries.forEach((e,i) => { e["key"]=i;});
          this.countries = response.data.countries;
        });
        axios.get('https://mobile.covisian.com/routing/bridge/bridge-to-services-86/WsWorkPlace/api/workPlace/loadWorkPlace?key=workPlace')
        .then(response => {
          this.workplaces = response.data.workPlace;
        });
      },
      methods : {
        requestLogin() {
            this.loading=true;
            this.loginError="";
            if(this.userName=="" || this.passWord=="" || this.selCountry==-1 || this.selWP==-1) {
              this.loading=false;
              this.loginError="Login Failed."
              return;
            }
            let loginReq = {
              'username' : this.userName,
              'password' : this.passWord,
              'IdCorporate' : this.countries[this.selCountry].IdCorporate,
              'country' : this.countries[this.selCountry].name,
              'IdSource' : "RequestReportRAS",
              'workPlace' : this.selWP
            }
            axios.post('https://mobile.covisian.com/routing/bridge/bridge-to-services-154/SpartaAAver2/SigninService', loginReq)
            .then(response => {
              this.$emit("logged-in", response.data);
              this.loading=false;
            })
            .catch(error => {
              if(error.response == undefined)
              {
                this.loginError="Service Unavailable."
                this.$emit("login-error", "Service Unavailable.");
                this.loading=false;
              }
              else {
                this.loginError="Not Authorized."
                this.$emit("login-error", "Not Authorized.");
                this.loading=false;
              }
            });
          }
      }
  });