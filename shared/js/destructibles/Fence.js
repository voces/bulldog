
class Fence extends Destructible {
    constructor(props = {}) {

        let orientation = props.orientation || (Math.random() < 0.5 ? "horizontal" : "vertical"),
            length = props.length || Math.floor(Math.random() * 2) * 2 + 2;

        props.footprint = {
            map: Array(length).fill(FOOTPRINT_TYPE.OBSTACLE),
            width: orientation === "horizontal" ? length : 1,
            height: orientation === "horizontal" ? 1 : length,
            radius: 0
        };

        super(props);

        this.geometry = new THREE.Geometry();

        this.length = length;
        this.orientation = orientation;

        this.height = props.height || 16;
        this.radius = props.width || 1;

        this.createPosts();
        this.createRails();

        this.createMesh();

    }

    createPost() {

        let post = new THREE.CylinderGeometry(
            this.radius + Math.random() / 2,
            this.radius + Math.random() / 2,
            this.height + Math.random() * 2);

        for (let i = 0; i < post.faces.length; i++)
            post.faces[i].color.setHex(0x99692E);

        post.rotateX(Math.PI / 2 + (Math.random() - 0.5) / 6);
        post.rotateZ(Math.PI * Math.random());
        post.rotateY((Math.random() - 0.5) / 6);
        post.translate(0, 0, this.height / 2);

        post.computeFaceNormals();
        post.computeVertexNormals();

        return post;

    }

    createRail() {

        let rail = new THREE.CylinderGeometry(
            this.radius + Math.random() / 4,
            this.radius + Math.random() / 4,
            (this.height + Math.random()) * this.length / 2);

        for (let i = 0; i < rail.faces.length; i++)
            rail.faces[i].color.setHex(0x99692E);

        rail.rotateY(Math.PI * Math.random());
        rail.rotateX((Math.random() - 0.5) / 4);

        rail.computeFaceNormals();
        rail.computeVertexNormals();

        return rail;

    }

    createPosts() {

        let postDisplacement = this.length * 4 - 4;

        let leftPost = this.createPost();

        if (this.orientation === "horizontal") leftPost.translate(-postDisplacement, 0, 0);
        else leftPost.translate(0, -postDisplacement, 0);

        this.geometry.merge(leftPost);

        let rightPost = this.createPost();

        if (this.orientation === "horizontal") rightPost.translate(postDisplacement, 0, 0);
        else rightPost.translate(0, postDisplacement, 0);

        this.geometry.merge(rightPost);

    }

    createRails() {

        let topRail = this.createRail();

        topRail.translate(0, 0, this.height / 3);

        if (this.orientation === "horizontal") topRail.rotateZ(Math.PI / 2);

        this.geometry.merge(topRail);

        let bottomRail = this.createRail();

        bottomRail.translate(0, 0, this.height / 3 * 2);

        if (this.orientation === "horizontal") bottomRail.rotateZ(Math.PI / 2);

        this.geometry.merge(bottomRail);

    }
}

TYPES.Fence = Fence;
