import { useRef, useEffect, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const useThreeScene = () => {
  const { camera, scene, gl } = useThree();
  const sceneRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lightsRef = useRef([]);
  const objectsRef = useRef([]);

  // Initialize scene
  useEffect(() => {
    sceneRef.current = scene;

    // Set up scene properties
    scene.fog = new THREE.Fog("#0a161c", 10, 100);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.3);
    scene.add(ambientLight);
    lightsRef.current.push(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
    directionalLight.position.set(10, 20, 15);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);
    lightsRef.current.push(directionalLight);

    // Cleanup
    return () => {
      lightsRef.current.forEach((light) => {
        if (light.parent) {
          light.parent.remove(light);
        }
      });
      lightsRef.current = [];
    };
  }, [scene]);

  // Add object to scene
  const addObject = useCallback((object) => {
    if (sceneRef.current && object) {
      sceneRef.current.add(object);
      objectsRef.current.push(object);
      return object;
    }
    return null;
  }, []);

  // Remove object from scene
  const removeObject = useCallback((object) => {
    if (sceneRef.current && object && object.parent) {
      sceneRef.current.remove(object);
      objectsRef.current = objectsRef.current.filter((obj) => obj !== object);
    }
  }, []);

  // Clear all custom objects
  const clearObjects = useCallback(() => {
    objectsRef.current.forEach((object) => {
      if (object.parent) {
        sceneRef.current.remove(object);
      }
    });
    objectsRef.current = [];
  }, []);

  // Camera control helpers
  const setCameraPosition = useCallback(
    (x, y, z) => {
      camera.position.set(x, y, z);
      camera.lookAt(0, 0, 0);
    },
    [camera]
  );

  const animateCameraTo = useCallback(
    (targetPosition, duration = 1000) => {
      const startPosition = camera.position.clone();
      const endPosition = new THREE.Vector3(...targetPosition);
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth easing function
        const easedProgress =
          progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;

        camera.position.lerpVectors(startPosition, endPosition, easedProgress);
        camera.lookAt(0, 0, 0);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [camera]
  );

  // Raycasting for object selection
  const raycastFromScreen = useCallback(
    (x, y, objects = []) => {
      const mouse = new THREE.Vector2();
      const raycaster = new THREE.Raycaster();

      // Convert screen coordinates to normalized device coordinates
      mouse.x = (x / gl.domElement.clientWidth) * 2 - 1;
      mouse.y = -(y / gl.domElement.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const targets = objects.length > 0 ? objects : objectsRef.current;
      const intersects = raycaster.intersectObjects(targets, true);

      return intersects;
    },
    [camera, gl]
  );

  // Get screen position from 3D world position
  const getScreenPosition = useCallback(
    (worldPosition) => {
      const vector = worldPosition.clone();
      vector.project(camera);

      const x = ((vector.x + 1) / 2) * gl.domElement.clientWidth;
      const y = ((-vector.y + 1) / 2) * gl.domElement.clientHeight;

      return { x, y };
    },
    [camera, gl]
  );

  // Animation loop
  useFrame((state, delta) => {
    // Update any custom animations here
    objectsRef.current.forEach((object) => {
      if (object.userData?.update) {
        object.userData.update(state, delta);
      }
    });
  });

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    // Scene references
    scene: sceneRef.current,
    camera,
    renderer: gl,

    // Object management
    addObject,
    removeObject,
    clearObjects,
    objects: objectsRef.current,

    // Camera control
    setCameraPosition,
    animateCameraTo,

    // Raycasting
    raycastFromScreen,
    getScreenPosition,

    // Scene state
    getObjectByName: useCallback((name) => {
      return sceneRef.current?.getObjectByName(name);
    }, []),

    traverseScene: useCallback((callback) => {
      sceneRef.current?.traverse(callback);
    }, []),

    // Scene effects
    setFog: useCallback((color, near, far) => {
      if (sceneRef.current) {
        sceneRef.current.fog = new THREE.Fog(color, near, far);
      }
    }, []),

    // Performance
    setPixelRatio: useCallback(
      (ratio) => {
        gl.setPixelRatio(ratio);
      },
      [gl]
    ),
  };
};
