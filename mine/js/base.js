let refreshToken;
let accessToken;
let refreshTokenObj;
let accessTokenObj;
let nowTokenInfoPage = 'rt';

let bookData;

let tokenModalE = new bootstrap.Modal(document.getElementById('token-modal'));

let bookModalE = new bootstrap.Modal(document.getElementById('book-info-modal'));
let bookModal = document.getElementById('book-info-modal'); 
bookModal.addEventListener('show.bs.modal', function (event) { 
	let btnE = event.relatedTarget;
	let mode = btnE.getAttribute('mode');
	let bookId = btnE.getAttribute('id');
	let bookJson;
	if(mode == 's'){ //singleton
		bookJson = bookData;
	}else{ // multiple
		bookJson = bookData.find( e => e.id == bookId );
	}
	setBookDetailData();

	function setBookDetailData(){
		$("#book-id").val(bookJson.id);
		$("#book-title").val(bookJson.mainTitle);
		$("#book-type").val(bookJson.type);
		$("#book-acquiredYear").val(bookJson.acquiredYear);
		$("#book-owner").val(bookJson.owner);
		$("#book-available").val(bookJson.available);
		$("#book-creator").val(bookJson.creator);
		$("#book-createdYear").val(bookJson.createdYear);
		$("#book-imageUrl").val(bookJson.imageUrl);
		$("#book-originalUrl").val(bookJson.originalUrl);
		$("#book-ownerCollectionsWebsite").val(bookJson.ownerCollectionsWebsite);
		$("#book-ownerWebsite").val(bookJson.ownerWebsite);
		$("#book-description").val(bookJson.description);
	}
});

let monitorModalE = new bootstrap.Modal(document.getElementById('monitor-modal'));


function changeTokenInfoPage(page){
	if(nowTokenInfoPage == page ){
		return false;
	}
	if(page == 'rt'){
		$("#at-switch").removeClass("border border-4 border-info border-top-0 border-start-0 border-end-0");
		$("#rt-switch").addClass("border border-4 border-info border-top-0 border-start-0 border-end-0");
		turnPage(page);
		nowTokenInfoPage = page;
	}else{
		$("#at-switch").addClass("border border-4 border-info border-top-0 border-start-0 border-end-0");
		$("#rt-switch").removeClass("border border-4 border-info border-top-0 border-start-0 border-end-0");
		turnPage(page);
		nowTokenInfoPage = page;
	}

	function turnPage(page){
		if(page=='rt'){
				$('#at-block').animate({left:"+=1000px"},"fast",function(){
				$("#at-block").addClass("d-none");
				$("#rt-block").removeClass("d-none");
				$('#rt-block').animate({left:"+=1000px"},"fast");
			});
		}else{
			$('#rt-block').animate({left:"-=1000px"},"fast",function(){
				$("#rt-block").addClass("d-none");
				$("#at-block").removeClass("d-none");
				$('#at-block').animate({left:"-=1000px"},"fast");
			});
		}
	}
}



function enableAuthComponent(){
	$("#token-detail-btn").prop("disabled", false);
	$("#logout-btn").prop("disabled", false);
}

function setUserInfoToView(claims){
	$("#user-id").val(claims.id);
	$("#user-name").val(claims.name);
	$("#user-role").val(claims.role);
}

function decodeTokenToJsonObj(token,type){
	let headerStr = token.split(".")[0];
	let headerJsonStr = Base64.decode(headerStr);
	let headerJsonObj = JSON.parse(headerJsonStr);
	let claimStr = token.split(".")[1];
	let claimJsonStr = Base64.decode(claimStr);
	let claimJsonObj = JSON.parse(claimJsonStr);
	if(type=='rt'){
		return {"headers":headerJsonObj , "claims":claimJsonObj};
	}else{
		return {"headers":headerJsonObj , "claims":claimJsonObj};
	}
}

function logoutFunc(){
	if(refreshToken == undefined){
		showSweetAlert(gINFO,"Not logged in.");
	}else{
		let title = "Are you sure you want to log out?";
		showSweetAlert(gCONFIRM,title,"" , ()=>{
			resetAuth();
		});
	}
}

function resetAuth(){
	refreshToken = undefined;
	accessToken = undefined;
	refreshTokenObj = undefined;
	accessTokenObj = undefined;
	removeUserInfoOfView();
	disableAuthComponent();
	removeTheMarkOfFakeData();
}

function removeUserInfoOfView(){
	$("#user-id").val("");
	$("#user-name").val("");
	$("#user-role").val("");
}

function disableAuthComponent(){
	$("#token-detail-btn").prop("disabled", true);
	$("#logout-btn").prop("disabled", true);
}

function showTokenDetails(){
	if(refreshToken == undefined){
		showSweetAlert(gINFO,"Not logged in.");
	}else{
		setValueIntoRTDetails();
		setValueIntoATDetails();
		tokenModalE.show();
	}
}

function setValueIntoRTDetails(){
	$("#rt-block .raw-token").val(refreshToken);
	$("#rt-block .algo").val(refreshTokenObj.headers.alg);
	$("#rt-block .iss").val(refreshTokenObj.claims.iss);
	$("#rt-block .exp").val(refreshTokenObj.claims.exp);
	$("#rt-block .sub").val(refreshTokenObj.claims.sub);
	$("#rt-block .uid").val(refreshTokenObj.claims.id);
}

function setValueIntoATDetails(){
	$("#at-block .raw-token").val(accessToken);
	$("#at-block .algo").val(accessTokenObj.headers.alg);
	$("#at-block .iss").val(accessTokenObj.claims.iss);
	$("#at-block .exp").val(accessTokenObj.claims.exp);
	$("#at-block .sub").val(accessTokenObj.claims.sub);
	$("#at-block .uid").val(accessTokenObj.claims.id);
	$("#at-block .uname").val(accessTokenObj.claims.name);
	$("#at-block .urole").val(accessTokenObj.claims.role);
}




function forgeAT() {
	accessTokenObj.claims.id = "admin";
	accessTokenObj.claims.name = "我是駭客";
	accessTokenObj.claims.role = "ADMIN,ADVANCED,NORMAL";
	let fakeClaimStr = Base64.encode(JSON.stringify(accessTokenObj.claims),true);
	let tokenStructureArr = accessToken.split(".");
	let fakeAccessToken = tokenStructureArr[0] + "." + fakeClaimStr + "." + tokenStructureArr[2];
	accessToken = fakeAccessToken;
	setValueIntoATDetails();
	setUserInfoToView(accessTokenObj.claims);
	markTheFakeData();

	function markTheFakeData(){
		$("#user-id").addClass("text-danger");
		$("#user-name").addClass("text-danger");
		$("#user-role").addClass("text-danger");

		$("#at-block .raw-token").addClass("text-danger");
		$("#at-block .uid").addClass("text-danger");
		$("#at-block .uname").addClass("text-danger");
		$("#at-block .urole").addClass("text-danger");
	}
}

function removeTheMarkOfFakeData(){
	$("#user-id").removeClass("text-danger");
	$("#user-name").removeClass("text-danger");
	$("#user-role").removeClass("text-danger");

	$("#at-block .raw-token").removeClass("text-danger");
	$("#at-block .uid").removeClass("text-danger");
	$("#at-block .uname").removeClass("text-danger");
	$("#at-block .urole").removeClass("text-danger");
}


function showBookResult(mode,jqXHR){ 

	let body = jqXHR.responseJSON;
	resetBookResult();
	setHeaderValue();
	if(mode=='m'){ //multiple
		setPaginationValue();
		body.result.forEach(ele => {
			appendBookIntoBookBlock(ele,mode);
		});
	}else{ //singleton
		appendBookIntoBookBlock(body,mode);
		$("#book-block").addClass("justify-content-center");
	}

	function setHeaderValue(){
		let locField = jqXHR.getResponseHeader("Location")
		$("#res-sname").val(jqXHR.getResponseHeader("Server-Name"));
		$("#res-loc").val(`${locField == null ? "" : locField}`);
	}

	function setPaginationValue(){
		$("#res-now-p").val(body.nowPage);
		$("#res-p-size").val(body.pageSize);
		$("#res-total-p").val(body.totalPages);
		$("#res-total-e").val(body.totalElements);
	}

	function appendBookIntoBookBlock(book,mode){
		$("#book-block").append(`
			<div class="my-bg-brown border mx-1 rounded-3 my-shadow h-100 my-word-wrap my-cursor-pointer" mode="${mode}" id="${book.id}" data-bs-toggle="modal" data-bs-target="#book-info-modal">
				<div class="p-2 my-fs-18-px text-center fw-bold text-light" style="width:120px;" title="mainTitle">
							${truncateTitleToExpectedLength(book.mainTitle)}
				</div>
					<div class="d-flex justify-content-center">
						<div class="my-fs-18-px text-warning border border-2 px-1 text-center text-truncate w-75" title="acquiredYear">
							${book.acquiredYear}
					</div>
				</div>
			</div>`);			
	}

	function truncateTitleToExpectedLength(title){
		let len = 10;
		let truncTit = title.substring(0, len);
		return title.length > 10 ? truncTit + "..." : truncTit;
	}
}

function resetBookResult(){
	$("#result-block input").val("");
	$("#book-block").html("");
	$("#book-block").html("").removeClass("justify-content-center");
}