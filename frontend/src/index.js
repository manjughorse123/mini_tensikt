import React from "react";
import ReactDOM from "react-dom";
import Alert from "@mui/material/Alert";
import { Container,Row,Col,Button } from "react-bootstrap";
import { getapi,header,imgapi,transapi } from "./constant"
import "./app.css";
import axios from "axios";
class Viewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      solved: false,
      data:null,total:0,checkClick:false,
      transfer:{gr:"",tdata:[],hdata:[],selectedHuman:[],selectedTermi:[]}}
    };

    
    // make selectable
    checkClickfun = (dd)=>{
      if(this.state.checkClick==false){
      
      this.setState({checkClick:true});
      this.setState({gr:dd.group});

      document.getElementById(dd.id).classList.add("applyonselect")
      if(dd.group=="terminator"){
         this.state.transfer.selectedHuman.push(dd)
         this.setState({selectedHuman:this.state.transfer.selectedHuman})

      }
      if(dd.group=="human"){
       this.state.transfer.selectedTermi.push(dd)
       this.setState({selectedTermi:this.state.transfer.selectedTermi})

     }

    }else{
      this.setState({checkClick:false});
      document.getElementById(dd.id).classList.remove("applyonselect")
     if(dd.group=="terminator"){
       let td = this.state.transfer.selectedTermi
       this.state.transfer.selectedTermi.map((item,index) =>{
          if(item.id==dd.id){
            td.splice(index,1);  
          }
       })
 
       this.setState({selectedTermi:td})
     
      }
     if(dd.group=="human"){
      let td = this.state.transfer.selectedHuman
      this.state.transfer.selectedHuman.map((item,index) =>{
         if(item.id==dd.id){
           td.splice(index,1);  
         }
      })
 
       this.setState({selectedHuman:td})

     }   
    }
  }
   async componentDidMount(){
     let result=null;
     let resp=null;
     resp = await fetch(getapi,header)
     .then(response => response.json()).then(function(res){
       result =res
      });
      let imgdata=result.imgData;
      let hcollect=[];let tcollect=[];
      this.setState({total:result.total});
      for(let i=0;i<this.state.total;i++){
        if(imgdata[i].group=="terminator"){
          this.state.transfer.tdata.push(imgdata[i]);
          this.setState({tdata:this.state.transfer.tdata})
        }
        if(imgdata[i].group=="human"){
         this.state.transfer.hdata.push(imgdata[i]);
         this.setState({hdata:this.state.transfer.hdata})
        }
      }
   
      
   }

    moveToTerminator = ()=>{
     this.state.transfer.tdata = [...this.state.transfer.tdata, ...this.state.transfer.selectedHuman]
     this.setState({tdata:this.state.transfer.tdata})
     this.removeElement(this.state.transfer.selectedHuman);
    }
    
    moveToHuman = ()=>{
       this.state.transfer.hdata = [...this.state.transfer.hdata, ...this.state.transfer.selectedTermi]
       this.setState({hdata:this.state.transfer.hdata})
       this.removeElement(this.state.transfer.selectedTermi);

    }
    removeElement = (element)=>{
      
     if(element[0].group=="human"){
       let td=this.state.transfer.tdata;
       element.forEach(item =>{
        this.state.transfer.tdata.map((ele,index) => {
          if(item.id==ele.id){
            td.splice(index,1);  
            document.getElementById(ele.id).classList.remove("applyonselect")         
          }
        })
       })
    
       this.setState({tdata:td});
     }
     if(element[0].group=="terminator"){
       let hd = this.state.transfer.hdata;
       element.forEach(item =>{
        this.state.transfer.hdata.map((ele,index) => {
          if(item.id==ele.id){
            hd.splice(index,1);
            document.getElementById(ele.id).classList.remove("applyonselect")
          }
        })
       })
      
       this.setState({hdata:hd});
     }
    }
    getObject(item) {
     let id=item.id
     let filepath=item.filepath
     let group=item.group=="human"?"terminator":"human";
     let isclicked = item.isclicked
     let title = item.title
     return {filepath,group,id,isclicked,title} 
    }
    saveData = () =>{
    let  mdata = [...this.state.transfer.selectedHuman, ...this.state.transfer.selectedTermi]
    var arr = {};
    if(mdata!=null){
      mdata.map(item =>{
        if(item!=null){
          let id =item.id
          arr[id]=item
        
        }
      })

     const response  = axios({
       method:"POST",
       url:transapi,
       data:{"imgMetadata":arr},
       headers:{
           "Content-Type":"application/json",
           "Accept":"application/json"
       }
     })
     this.setState({selectedHuman:[]})
     this.setState({selectedTermi:[]})
     this.setState({solved:true});
    }
   }
  render() {
    let showAlert = this.state.solved;
    let alertContent;

    if (showAlert) {
      alertContent = (
        <Alert severity="success">
          Thank you for saving humanity, Tenyksian!
        </Alert>
      );
    } else {
      alertContent = <Alert severity="warning">Humanity is in danger!</Alert>;
    }

    let content = (
      <div>
        {alertContent}
        <Button variant="success" onClick={this.saveData}>SAVE IMAGES</Button>  
        <div style={{ textAlign: "center" }}>
          Tenyks Mini-Project Submission{" "}
        </div>
        {/*  TODO: add generation of your viewer   */}
      </div>
    );

    return (
      <>
        {content}

        <Container>  
       
        <Button variant="primary" className="primary" onClick={this.moveToHuman}>MOVE TO HUMAN</Button>
        <div  style={{height:"300px",overflowY:"auto"}}>
          <ul style={{listStyle:"none"}}>
          <Row >     
            {
            this.state.transfer.tdata!==null && this.state.transfer.tdata.map((item) => 
              <Col onClick={()=>this.checkClickfun(this.getObject(item))}  id={item.id}><li key={item.id}><img src={imgapi+item.id} className="img "  /></li> </Col>
            )
            }   
           </Row>
          </ul>
        </div>
        <Button variant="primary" className="primary" onClick={this.moveToTerminator}> MOVE TO TERMINATOR </Button><br />
        <div  style={{height:"300px",overflowY:"auto"}}>
          <ul style={{listStyle:"none"}}>
           <Row >     
            {
            this.state.transfer.hdata!==null && this.state.transfer.hdata.map((item) => 
              <Col onClick={()=>this.checkClickfun(this.getObject(item))}  id={item.id}><li key={item.id}><img src={imgapi+item.id} className="img "  /></li> </Col>

            )
            }   
           </Row>

          </ul>
        </div>

        </Container>
      </>
    );
  }
}

ReactDOM.render(<Viewer />, document.getElementById("root"));
