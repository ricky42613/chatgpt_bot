var count = 0
var stop_auto = false
var first_question = true
var usr_name = 'YC thegod'
function creat_auto_prompt_block(){
	// let model_list_btn = document.querySelector('[id*=headlessui-listbox-label]')
	let model_list_btn = document.querySelector('.stretch')

	let default_prompt = '從以下句子中找出屬於事件陳述句型的句子，輸出格式僅保留句子編號，並以逗號隔開。例如:1，3，6'

	let modal = `
	<button class="btn btn-primary" id="edit_row_btn">
		auto script
 	</button>
	<!-- dragable and editable bootsttrap modal modal -->
	<div class="modal fade" id="dragable_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel2" data-backdrop="static" data-keyboard="false">
	  <div class="modal-dialog" role="document">
		<div class="modal-content">
		  <div class="modal-header w-100">
			<div class="row m-0 w-100">
			  <div class="col-md-12 px-4 p-2 dragable_touch d-block">
				<h3 class="m-0 d-inline">Edit row settings</h3>
			  </div>
	
			</div>
	
		  </div>
	
		  <div class="modal-body p-3">
	
			<div class="tab-content" id="myTabContent">
			  <div class="tab-pane fade show active" id="row_seetings_general_tab" role="tabpanel" aria-labelledby="home-tab">
				<div class="form-group">
				  <label for="prompt">prompt</label>
				  <input type="text" class="form-control" id="prompt" value="${default_prompt}">
				</div>
				<div class="form-group">
				  <label for="data">data</label>
				  <input type="file" class="form-control" id="data"/>
				</div>
			  </div>
			</div>
		  </div>
	
		  <div class="modal-footer bg-light">
			<div class="row w-100">
			  <div class="col-6">
				<button type="reset" class="btn btn-primary cancel" data-dismiss="modal">Cancel</button>
			  </div>
			  <div class="col-6 text-right">
				<button type="button" id="start_prompt" class="btn btn-primary">Start</button>
			  </div>
			</div>
		  </div>
		</div>
	  </div>
	</div>`

	model_list_btn.insertAdjacentHTML('afterEnd', modal)
}
 
var QA_pair = []
var last_uuid = ''
var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		setTimeout(function(){
			creat_auto_prompt_block()
			$(document).on('click', "#edit_row_btn", function(){
				$("#dragable_modal").modal({
					backdrop: false,
					show: true,
				  });
				  // reset modal if it isn't visible
				  if (!$(".modal.in").length) {
					$(".modal-dialog").css({
					  top: 20,
					  left: 100,
					});
				  }
				
				  $(".modal-dialog").draggable({
					cursor: "move",
					handle: ".dragable_touch",
				  });
			})
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation){
					if(mutation.addedNodes.length && mutation.addedNodes[0].previousSibling){
						let last_elem = mutation.addedNodes[0].previousSibling.querySelectorAll(`[alt="${usr_name}"]`)
						if (last_elem.length){
							// console.log('start save QA...')
							// setTimeout(function(){
							// 	let q = mutation.addedNodes[0].previousSibling.textContent
							// 	let a = mutation.addedNodes[0].textContent
							// 	QA_pair.push({'q': q, 'a': a})
							// 	count += 1
							// 	let rst = {'count': count, 'msgs': QA_pair}
							// 	console.log(rst)
							// 	chrome.runtime.sendMessage({'type': 'save_msg', 'data': rst}, function(r){
							// 		console.log(rst)
							// 	})
							// },90000)
						}
					}
				})
			})
			var msg_block = document.querySelectorAll('.items-center')[4]

			observer.observe(msg_block, {
				childList: true
			})
		},5000)
	}
}, 10);

$(document).on('click', '.cancel', function(){
	stop_auto = true
})

$(document).on('click', '#start_prompt', function(){
	stop_auto = false
	// 對以下段落參考spacy建立句法分析樹後，根據句法分析樹輸出關鍵字之間的關係，輸出格式 關鍵字1 -- 關鍵字2
	let prompt = $('#prompt')[0].value
	console.log(`start prompt: ${prompt}`)
	var reader = new FileReader();
	reader.onload = function() {
		var text = reader.result;
		var data = JSON.parse(text)
		var msg_que = []
		for (let uuid in data) {
			let test_sentence = ''
			let idx_offset = 0 
			data[uuid].forEach((s,idx) => {
				let tmp = s.split('|', 2)
				if(tmp.length > 1){
					sent = tmp[1]
					test_sentence += `${idx+1-idx_offset}. ${sent}\n`
					if (test_sentence.length > 200){
						let info = {'uuid': uuid, 'msg': test_sentence}
						msg_que.push(info)
						test_sentence = ''
						idx_offset = idx+1
					}
				}
			});
			if (test_sentence.length > 0){
				let info = {'uuid': uuid, 'msg': test_sentence}
				msg_que.push(info)
				test_sentence = ''
			}
		}
		console.log(msg_que)
		let p = Promise.resolve();
		for (let idx in msg_que) {
			p = p.then(_ => new Promise(inner_resolve => {
				let timer = setInterval(function(){
					// item = data[uuid]
					let uuid = msg_que[idx]['uuid']
					console.log(msg_que[idx])
					let form_btns = document.querySelectorAll('main form button')
					console.log('btn:', form_btns[0].textContent)
					if (stop_auto) {
						clearInterval(timer)
						inner_resolve()
					}else if (first_question || form_btns[0].textContent.indexOf('Stop')==-1){
						clearInterval(timer)
						if(!first_question){
							console.log('start save result')
							all_dialog = document.querySelectorAll('.group')
							q = document.querySelectorAll('.group')[all_dialog.length-2].textContent
							a = document.querySelectorAll('.group')[all_dialog.length-1].textContent
							QA_pair.push({'uuid': last_uuid,'q': q, 'a': a})
							count += 1
							let rst = {'count': count, 'msgs':  QA_pair}
							console.log(rst)
							chrome.runtime.sendMessage({'type': 'save_msg', 'data': rst}, function(r){
								console.log(rst)
							})
						}
						first_question = false
						// let test_sentence = `Q：${item.input} | A：${item.output}`
						// let test_sentence = ''
						// data[uuid].forEach((s,idx) => {
						// 	let tmp = s.split('|', 2)
						// 	if(tmp.length > 1){
						// 		sent = tmp[1]
						// 		test_sentence += `${idx+1}. ${sent}\n`
						// 	}
						// });
						let test_sentence = msg_que[idx]['msg']
						last_uuid = uuid
						console.log('test sentence', test_sentence)
						form_btns[form_btns.length-1].removeAttribute('disabled')
						if (document.querySelector('main textarea')!= null){
							document.querySelector('main textarea').textContent = `${prompt}\r\n${test_sentence}`
							document.querySelector('main textarea').value = `${prompt}\r\n${test_sentence}`
							document.querySelector('main textarea').nextElementSibling.click()
						} else {
							stop_auto = true
						}
						inner_resolve()
					}
				}, 40000)
			}))
		}
		// for (let uuid in data) {
		// 	p = p.then(_ => new Promise(inner_resolve => {
		// 		let timer = setInterval(function(){
		// 			let form_btns = document.querySelectorAll('main form button')
		// 			if (stop_auto) {
		// 				console.log(uuid)
		// 				clearInterval(timer)
		// 				inner_resolve()
		// 			}else if (!form_btns[form_btns.length-1].disabled){
		// 				console.log(uuid)
		// 				clearInterval(timer)
		// 				let test_sentence = ''
		// 				data[uuid].forEach((s,idx) => {
		// 					test_sentence += `${idx+1}. ${s}\n`
		// 				});
		// 				console.log(test_sentence)
		// 				if (document.querySelector('main textarea')!= null){
		// 					document.querySelector('main textarea').value = `${prompt}\r\n${test_sentence}`
		// 					document.querySelector('main textarea').nextElementSibling.click()
		// 				} else {
		// 					stop_auto = true
		// 				}
		// 				inner_resolve()
		// 			}
		// 		}, 5000)
		// 	}))
		// }
	};
	var input = document.querySelector('#data')
	reader.readAsText(input.files[0]);
})