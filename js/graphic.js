
{class Graphic extends EventEmitter2 {

    constructor() {
        super();

        this.updates = [];

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: document.querySelector("canvas")
        });

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.shadowMap.soft = true;

        this.renderer.setClearColor(new THREE.Color("#333"), 1);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // document.addEventListener("DOMContentLoaded", () =>
        //     document.body.appendChild(this.renderer.domElement));

        this.scene = new THREE.Scene();
        this.defaultScene = this.scene;

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
        // this.camera.position.z = 20;
        // this.camera.position.y = -30;
        this.camera.position.z = 300;
        this.camera.position.y = -200;
        // this.camera.rotation.y = Math.PI / 2;
        this.camera.rotation.x = 0.593412;
        this.defaultCamera = this.camera;

        // this.renderer.shadowCameraNear = 3;
        // this.renderer.shadowCameraFar = this.camera.far;

        let shadowDetail = 4096;

        this.renderer.shadowMapWidth = shadowDetail;
        this.renderer.shadowMapHeight = shadowDetail;

        this.scene.fog = new THREE.Fog(0x111111);

        this.sun = new THREE.DirectionalLight(0xffffff, 1);
        this.sun.position.set(-50, -10, 100);
        // this.light.position.set(-50, 0, 100);

        this.sun.castShadow = true;
        this.sun.shadow.camera.near = -64;
        this.sun.shadow.camera.far = 224;
        this.sun.shadow.camera.left = -224;
        this.sun.shadow.camera.right = 224;
        this.sun.shadow.camera.top = 144;
        this.sun.shadow.camera.bottom = -144;
        // this.light.shadow.bias = -0.001;

        this.scene.add(this.sun);

        this.ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(this.ambientLight);

        // this.scene.add(new THREE.CameraHelper(this.light.shadow.camera));

        // this.controls = new THREE.OrbitControls(camera);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.mouse.moved = false;

        this.lastIntersect = Graphic.dummyIntersect;

        window.addEventListener("resize", () => this.onResize())
        document.addEventListener("mousemove", e => this.onMouseMove(e))
        document.addEventListener("mousedown", e => this.onMouseDown(e))
        document.addEventListener("mouseup", e => this.onMouseUp(e))

        this.lastTime = null;

        requestAnimationFrame(ms => this.render(ms));

    }

    onResize() {

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

    }

    onMouseMove(e) {

        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.mouse.moved = true;

    }

    onMouseDown(e) {

        if (e.target.constructor !== HTMLCanvasElement && e.target.className !== "game")
            return;

        if (this.lastIntersect) this.emit("mouseDown", this.lastIntersect);

    }

    onMouseUp(e) {

        if (e.target.constructor !== HTMLCanvasElement && e.target.className !== "game")
            return;

        if (this.lastIntersect) this.emit("mouseUp", this.lastIntersect);

    }

    mouseEvents() {

        //Quit if the camera/scene don't exist (can't intersect) or the mosue
        //  hasn't moved (not a new intersect)
        if (!this.camera || !this.scene || !this.mouse.moved) return;
        this.mouse.moved = false;

        //Intersect calculation
        this.raycaster.setFromCamera(this.mouse, this.camera);
        let intersect = this.raycaster.intersectObjects(this.scene.children)[0];

        //Exit if no intersect
        if (!intersect) {

            //Ignores dummies (no previous intersect)
            if (this.lastIntersect) this.emit("hoverOff", this.lastIntersect);

            this.lastIntersect = null;
            return;

        }

        //A new object is being intersected
        if (!this.lastIntersect || this.lastIntersect.object !== intersect.object) {

            //Ignores dummies (no previous intersect)
            if (this.lastIntersect) this.emit("hoverOff", this.lastIntersect, intersect);

            //Make sure we intersected something that is handled by the engine
            else this.emit("hoverOn", intersect);

            this.lastIntersect = intersect;

            return;

        }

        //Same object being intersected...
        if (this.lastIntersect) {

            //But a new face of the same object! (useful for Terrain)
            if (intersect.face != this.lastIntersect.face)
                this.emit("hoverFace", intersect, this.lastIntersect);

            //Emit hover event
            else this.emit("hover", intersect)

            this.lastIntersect = intersect;

        }

    }

    render(nowMsec) {

        requestAnimationFrame(ms => this.render(ms));

        this.mouseEvents();

		// measure time
		this.lastTime = this.lastTime || nowMsec - 1000 / 60
		let deltaMsec = Math.min(200, nowMsec - this.lastTime)
		this.lastTime = nowMsec

        this.renderer.render(this.scene, this.camera);

        for (let i = 0; i < this.updates.length; i++)
            this.updates[i].update(deltaMsec, nowMsec / 1000);

    }

}

Graphic.dummyIntersect = null;

window.graphic = new Graphic();}
// graphic.scene.add(new THREE.Mesh(
//     new THREE.TorusKnotGeometry(20, 5, 256, 32),
//     new THREE.MeshNormalMaterial()));
