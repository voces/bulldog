
class Animated extends Behavior {
    constructor(props) {
        super(props);

        this.entity.mesh = new THREE.SkinnedMesh(this.entity.geometry, this.entity.material);
        this.entity.mesh.material.skinning = true;

        this.mixer = new THREE.AnimationMixer(this.entity.mesh);

        this.animations = {};

        for (let i = 0; i < this.entity.geometry.animations.length; i++) {
            let animation = this.entity.geometry.animations[i];

            this.animations[animation.name] = animation;
            this.mixer.clipAction(animation);

            animation.play = weight => this.animate(animation.name, weight);

        }

        this.entity.animate = (animation, weight) => this.animate(animation, weight);
        this.entity.setAnimationSpeed =
            (animation, speed) => this.setAnimationSpeed(animation, speed);

        this.active = true;

    }

    update(delta) {
        this.mixer.update(delta);
    }

    animate(animation, weight = 1) {

        let remaining = 1 - weight,
            action = this.mixer.clipAction(animation);

        if (action.getEffectiveWeight() === weight) return;

        for (let i = 0; i < this.animations.length; i++)
            this.mixer.clipAction(this.animations[i].name).setEffectiveWeight(remaining);

        action.setEffectiveWeight(weight).play();

    }

    setAnimationSpeed(animation, speed) {

        this.mixer.clipAction(animation).setEffectiveTimeScale(speed);

    }
}
